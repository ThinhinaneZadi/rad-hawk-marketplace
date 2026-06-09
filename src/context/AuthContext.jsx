// AuthContext.jsx  (src/context/AuthContext.jsx)
//
// CHANGES FROM PREVIOUS VERSION:
//   - Added postListing(listingData) → saves a new listing to localStorage
//   - Added getListings()            → returns all listings ever posted
//   - Added deleteMyListing(id)      → lets a seller remove their own listing
//
// ⚠️  CLASS PROJECT NOTE:
//   Passwords are stored in localStorage for demo purposes only.
//   In a real app, passwords must be hashed on a secure backend (e.g. bcrypt).
//   Never store plain-text passwords in production.

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// localStorage key names — all in one place so they're easy to change
const USERS_KEY    = "rh_users";     // array of all registered users
const SESSION_KEY  = "rh_session";   // email of whoever is logged in
const LISTINGS_KEY = "rh_listings";  // array of all user-posted listings

// ── localStorage helpers ───────────────────────────────────────
function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function loadListings() {
  try { return JSON.parse(localStorage.getItem(LISTINGS_KEY)) || []; }
  catch { return []; }
}
function saveListings(listings) {
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
}

// ── Provider ───────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  // On page load — restore session if one was saved
  useEffect(() => {
    const email = localStorage.getItem(SESSION_KEY);
    if (email) {
      const found = loadUsers().find(u => u.email === email);
      if (found) setCurrentUser(found);
    }
  }, []);

  // ── register ─────────────────────────────────────────────────
  const register = (userData) => {
    const users = loadUsers();
    if (users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, message: "An account with this email already exists." };
    }
    const newUser = {
      id:           Date.now().toString(),
      fullName:     userData.fullName.trim(),
      email:        userData.email.trim().toLowerCase(),
      password:     userData.password,   // demo only — see note above
      role:         userData.role,
      collegeEmail: userData.collegeEmail?.trim() || "",
      phone:        userData.phone?.trim()         || "",
      bio:          userData.bio?.trim()           || "",
      joinedAt:     new Date().toLocaleDateString(),
      myListings:   [],
      savedItems:   [],
    };
    users.push(newUser);
    saveUsers(users);
    localStorage.setItem(SESSION_KEY, newUser.email);
    setCurrentUser(newUser);
    return { success: true };
  };

  // ── login ─────────────────────────────────────────────────────
  const login = (email, password) => {
    const found = loadUsers().find(
      u => u.email === email.trim().toLowerCase() && u.password === password
    );
    if (!found) return { success: false, message: "Incorrect email or password." };
    localStorage.setItem(SESSION_KEY, found.email);
    setCurrentUser(found);
    return { success: true };
  };

  // ── logout ────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
  };

  // ── updateUser (used for bio edits etc.) ──────────────────────
  const updateUser = (updatedData) => {
    const users = loadUsers();
    const idx   = users.findIndex(u => u.email === currentUser.email);
    if (idx === -1) return;
    users[idx] = { ...users[idx], ...updatedData };
    saveUsers(users);
    setCurrentUser(users[idx]);
  };

  // ── postListing ───────────────────────────────────────────────
  // Saves a new listing to localStorage and links it to the current user.
  // Returns { success: true, listing } or { success: false, message }
  const postListing = (listingData) => {
    if (!currentUser) return { success: false, message: "You must be logged in to post." };

    const listings = loadListings();

    // Build the listing object
    const newListing = {
      // Unique ID using timestamp — good enough for a class project
      id:          "user_" + Date.now().toString(),
      title:       listingData.title.trim(),
      price:       Number(listingData.price),
      category:    listingData.category,
      condition:   listingData.condition,
      description: listingData.description?.trim() || "",
      location:    listingData.location?.trim()    || "On Campus",
      image:       listingData.imagePreview        || null,  // base64 string or null
      seller:      "@" + currentUser.fullName.replace(/\s+/g, "").toLowerCase(),
      sellerName:  currentUser.fullName,
      sellerEmail: currentUser.email,
      // "posted" label shown on the card
      posted:      "Just now",
      postedAt:    new Date().toISOString(),
      // Flag so Marketplace knows this came from a user, not itemsData.js
      isUserListing: true,
    };

    // Save to the global listings array
    listings.push(newListing);
    saveListings(listings);

    // Also add the listing ID to the user's own myListings array
    const users = loadUsers();
    const idx   = users.findIndex(u => u.email === currentUser.email);
    if (idx !== -1) {
      users[idx].myListings = [...(users[idx].myListings || []), newListing.id];
      saveUsers(users);
      setCurrentUser(users[idx]);
    }

    return { success: true, listing: newListing };
  };

  // ── getListings ───────────────────────────────────────────────
  // Returns all user-posted listings from localStorage
  const getListings = () => loadListings();

  // ── getMyListings ─────────────────────────────────────────────
  // Returns only the listings posted by the currently logged-in user
  const getMyListings = () => {
    if (!currentUser) return [];
    return loadListings().filter(l => l.sellerEmail === currentUser.email);
  };

  // ── deleteMyListing ───────────────────────────────────────────
  // Removes a listing by ID (only works if it belongs to current user)
  const deleteMyListing = (listingId) => {
    const listings = loadListings().filter(l => {
      // Keep everything EXCEPT the listing that matches both id AND seller
      if (l.id === listingId && l.sellerEmail === currentUser.email) return false;
      return true;
    });
    saveListings(listings);

    // Remove from user's myListings array too
    const users = loadUsers();
    const idx   = users.findIndex(u => u.email === currentUser.email);
    if (idx !== -1) {
      users[idx].myListings = (users[idx].myListings || []).filter(id => id !== listingId);
      saveUsers(users);
      setCurrentUser(users[idx]);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      register,
      login,
      logout,
      updateUser,
      postListing,      // NEW
      getListings,      // NEW
      getMyListings,    // NEW
      deleteMyListing,  // NEW
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
