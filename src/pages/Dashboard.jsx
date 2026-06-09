// Dashboard.jsx  (src/pages/Dashboard.jsx)
//
// CHANGES FROM PREVIOUS VERSION:
//   - "Add New Listing" button now links to /sell
//   - New "My Listings" section shows the user's own posted items
//   - Each listing card has a Delete button
//   - Shows a count of active listings in the stats row

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const STYLES = `
  @keyframes dashIn {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .dash-card {
    background: #fff;
    border: 2px solid #ebebeb;
    border-radius: 10px;
    padding: 24px;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    animation: dashIn 0.5s ease both;
  }
  .dash-card:hover {
    border-color: #cc0000;
    box-shadow: 0 6px 20px rgba(204,0,0,0.1);
    transform: translateY(-3px);
  }
  .dash-action-btn {
    display: flex; align-items: center; gap: 10px;
    width: 100%; padding: 12px 16px;
    background: #fafafa; border: 1.5px solid #e8e8e8;
    border-radius: 8px; color: #111; font-size: 13px;
    font-weight: 600; font-family: Georgia, serif;
    text-decoration: none; cursor: pointer;
    transition: background 0.18s, border-color 0.18s, transform 0.15s;
    margin-bottom: 8px; text-align: left;
  }
  .dash-action-btn:hover {
    background: #fff0f0; border-color: #cc0000;
    color: #cc0000; transform: translateX(4px);
  }
  .dash-section-h {
    font-family: 'Bebas Neue', Impact, sans-serif;
    font-size: 18px; letter-spacing: 1.5px; color: #111;
    margin: 0 0 16px; display: flex; align-items: center; gap: 10px;
  }
  .dash-section-h::after {
    content: ''; flex: 1; height: 2px; background: #cc0000; border-radius: 1px;
  }
  .role-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 12px; border-radius: 20px;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.5px; text-transform: uppercase;
  }
  .role-badge.buyer  { background: #e8f5e9; color: #2e7d32; }
  .role-badge.seller { background: #fff3e0; color: #e65100; }
  .bio-input {
    width: 100%; padding: 10px 13px;
    border: 1.5px solid #e0e0e0; border-radius: 6px;
    font-size: 13px; font-family: Georgia, serif; color: #333;
    resize: vertical; outline: none; transition: border-color 0.2s;
    box-sizing: border-box;
  }
  .bio-input:focus { border-color: #cc0000; }
  .dash-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
  }

  /* My Listings mini card */
  .listing-mini {
    display: flex; gap: 12px; align-items: flex-start;
    padding: 12px; border: 1.5px solid #ebebeb; border-radius: 8px;
    margin-bottom: 10px; background: #fafafa;
    transition: border-color 0.18s;
  }
  .listing-mini:hover { border-color: #cc0000; }
  .listing-mini-img {
    width: 56px; height: 56px; border-radius: 6px;
    object-fit: cover; flex-shrink: 0; background: #eee;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; overflow: hidden;
  }
  .del-btn {
    background: none; border: none; color: #e53935;
    font-size: 11px; font-weight: 700; cursor: pointer;
    padding: 3px 8px; border-radius: 4px;
    transition: background 0.15s;
    font-family: Georgia, serif;
  }
  .del-btn:hover { background: #fce4ec; }

  @media (max-width: 700px) {
    .dash-grid { grid-template-columns: 1fr; }
    .dash-profile-header { flex-direction: column !important; align-items: flex-start !important; }
  }
`;

function StatPill({ label, value }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "'Bebas Neue', Impact, sans-serif",
        fontSize: "24px", color: "#cc0000", lineHeight: 1,
      }}>{value}</div>
      <div style={{ fontSize: "10px", color: "#999", letterSpacing: "0.5px", textTransform: "uppercase", marginTop: "2px" }}>
        {label}
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, to, onClick }) {
  if (to) return (
    <Link to={to} className="dash-action-btn">
      <span style={{ fontSize: "18px", flexShrink: 0 }}>{icon}</span>
      <span>{label}</span>
      <span style={{ marginLeft: "auto", color: "#bbb", fontSize: "12px" }}>→</span>
    </Link>
  );
  return (
    <button className="dash-action-btn" onClick={onClick}>
      <span style={{ fontSize: "18px", flexShrink: 0 }}>{icon}</span>
      <span>{label}</span>
      <span style={{ marginLeft: "auto", color: "#bbb", fontSize: "12px" }}>→</span>
    </button>
  );
}

export default function Dashboard() {
  const { currentUser, logout, updateUser, getMyListings, deleteMyListing } = useAuth();
  const navigate = useNavigate();

  const [editingBio, setEditingBio] = useState(false);
  const [bioText,    setBioText]    = useState(currentUser?.bio || "");
  const [bioSaved,   setBioSaved]   = useState(false);
  // Track deletions locally so the list updates without a page refresh
  const [deletedIds, setDeletedIds] = useState([]);

  if (!currentUser) {
    navigate("/auth");
    return null;
  }

  const isSeller  = currentUser.role === "Seller";
  const firstName = currentUser.fullName.split(" ")[0];

  // Get this user's listings, minus any just deleted this session
  const myListings = getMyListings().filter(l => !deletedIds.includes(l.id));

  const handleLogout = () => { logout(); navigate("/"); };

  const saveBio = () => {
    updateUser({ bio: bioText });
    setEditingBio(false);
    setBioSaved(true);
    setTimeout(() => setBioSaved(false), 2500);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Remove this listing from the marketplace?")) return;
    deleteMyListing(id);
    setDeletedIds(prev => [...prev, id]);
  };

  return (
    <>
      <style>{STYLES}</style>

      <main style={{ background: "#f7f7f7", minHeight: "100vh", padding: "40px 32px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

          {/* Page title */}
          <p style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "12px", letterSpacing: "4px",
            color: "#cc0000", textTransform: "uppercase", margin: "0 0 6px",
          }}>My Account</p>
          <h1 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "clamp(28px, 4vw, 42px)",
            color: "#111", letterSpacing: "1.5px", margin: "0 0 28px",
          }}>
            Welcome back, {firstName}!
          </h1>

          {/* ── Profile header card ── */}
          <div className="dash-card" style={{ marginBottom: "24px", borderTop: "4px solid #cc0000" }}>
            <div className="dash-profile-header" style={{
              display: "flex", alignItems: "flex-start", gap: "24px", flexWrap: "wrap",
            }}>
              {/* Avatar */}
              <div style={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: "linear-gradient(135deg, #cc0000, #8b0000)",
                color: "#fff", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "28px", fontWeight: 800,
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                boxShadow: "0 4px 14px rgba(204,0,0,0.3)",
              }}>
                {currentUser.fullName.charAt(0).toUpperCase()}
              </div>

              {/* Name + meta */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
                  <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#111" }}>
                    {currentUser.fullName}
                  </h2>
                  <span className={`role-badge ${isSeller ? "seller" : "buyer"}`}>
                    {isSeller ? "🏷️ Seller" : "🛒 Buyer"}
                  </span>
                </div>
                <p style={{ color: "#888", fontSize: "13px", margin: "0 0 6px", fontFamily: "Georgia, serif" }}>
                  {currentUser.email}
                  {currentUser.collegeEmail && (
                    <span style={{ marginLeft: "12px", color: "#bbb" }}>· {currentUser.collegeEmail}</span>
                  )}
                </p>
                <p style={{ color: "#bbb", fontSize: "11px", margin: 0, fontFamily: "Georgia, serif" }}>
                  Member since {currentUser.joinedAt}
                  {currentUser.phone && ` · ${currentUser.phone}`}
                </p>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: "24px", paddingLeft: "16px", borderLeft: "1px solid #ebebeb" }}>
                <StatPill label="My Listings"  value={myListings.length} />
                <StatPill label="Saved Items"  value={currentUser.savedItems?.length || 0} />
              </div>
            </div>

            {/* Bio */}
            <div style={{ marginTop: "20px", paddingTop: "18px", borderTop: "1px solid #f0f0f0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Bio
                </span>
                <button
                  onClick={() => { setEditingBio(e => !e); setBioText(currentUser.bio || ""); }}
                  style={{ background: "none", border: "none", color: "#cc0000", fontSize: "12px", fontWeight: 700, cursor: "pointer", padding: 0 }}
                >
                  {editingBio ? "Cancel" : "Edit"}
                </button>
              </div>
              {editingBio ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <textarea className="bio-input" rows={3}
                    placeholder="Tell the community about yourself…"
                    value={bioText} onChange={e => setBioText(e.target.value)} />
                  <button onClick={saveBio} style={{
                    alignSelf: "flex-start", padding: "8px 20px",
                    background: "#cc0000", color: "#fff", border: "none",
                    borderRadius: "5px", fontWeight: 700, fontSize: "12px", cursor: "pointer",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background="#a50000"}
                    onMouseLeave={e => e.currentTarget.style.background="#cc0000"}
                  >Save Bio</button>
                </div>
              ) : (
                <p style={{
                  color: currentUser.bio ? "#444" : "#ccc", fontSize: "13px",
                  fontFamily: "Georgia, serif", lineHeight: 1.7, margin: 0,
                  fontStyle: currentUser.bio ? "normal" : "italic",
                }}>
                  {currentUser.bio || "No bio yet — click Edit to add one."}
                </p>
              )}
              {bioSaved && <p style={{ color: "#2e7d32", fontSize: "11px", marginTop: "6px", fontFamily: "Georgia, serif" }}>✓ Bio updated!</p>}
            </div>
          </div>

          {/* ── Role note ── */}
          <div style={{
            background: "#fffbf0", border: "1.5px solid #ffe0a0",
            borderRadius: "8px", padding: "14px 18px", marginBottom: "24px",
            display: "flex", alignItems: "flex-start", gap: "10px",
          }}>
            <span style={{ fontSize: "18px", flexShrink: 0 }}>💡</span>
            <p style={{ color: "#7a5c00", fontSize: "12px", fontFamily: "Georgia, serif", lineHeight: 1.6, margin: 0 }}>
              <strong>Your main role is {currentUser.role}</strong> — but you can still{" "}
              {isSeller ? "browse and buy" : "post listings and sell"} anytime.
              Everyone on Rad Hawk Marketplace can both buy and sell.
            </p>
          </div>

          {/* ══════════════════════════════════════
              MY LISTINGS SECTION
              Shows items the user has posted
          ══════════════════════════════════════ */}
          <div className="dash-card" style={{ marginBottom: "24px", animationDelay: "0.04s" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 className="dash-section-h" style={{ margin: 0, flex: 1 }}>
                My Listings
              </h3>
              <Link to="/sell" style={{
                padding: "8px 18px", background: "#cc0000", color: "#fff",
                fontWeight: 700, fontSize: "12px", letterSpacing: "0.8px",
                textTransform: "uppercase", textDecoration: "none",
                borderRadius: "6px", marginLeft: "12px", flexShrink: 0,
                transition: "background 0.18s",
              }}
                onMouseEnter={e => e.currentTarget.style.background="#a50000"}
                onMouseLeave={e => e.currentTarget.style.background="#cc0000"}
              >
                + Post New Item
              </Link>
            </div>

            {myListings.length === 0 ? (
              // Empty state
              <div style={{ textAlign: "center", padding: "28px 16px" }}>
                <div style={{ fontSize: "36px", marginBottom: "10px" }}>📦</div>
                <p style={{ color: "#aaa", fontFamily: "Georgia, serif", fontSize: "13px", marginBottom: "14px" }}>
                  You haven't posted any listings yet.
                </p>
                <Link to="/sell" style={{
                  display: "inline-block", padding: "10px 22px",
                  background: "#cc0000", color: "#fff",
                  fontWeight: 700, fontSize: "12px", letterSpacing: "0.8px",
                  textTransform: "uppercase", textDecoration: "none",
                  borderRadius: "6px", transition: "background 0.18s",
                }}>
                  Post Your First Item →
                </Link>
              </div>
            ) : (
              // List of posted items
              myListings.map(listing => (
                <div key={listing.id} className="listing-mini">
                  {/* Thumbnail or placeholder */}
                  <div className="listing-mini-img">
                    {listing.image
                      ? <img src={listing.image} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : "📦"}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <p style={{ margin: "0 0 3px", fontSize: "13px", fontWeight: 700, color: "#111" }}>
                          {listing.title}
                        </p>
                        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                          <span style={{
                            background: "#f0f0f0", color: "#555",
                            fontSize: "9px", fontWeight: 700,
                            padding: "2px 6px", borderRadius: "3px", textTransform: "uppercase",
                          }}>{listing.category}</span>
                          <span style={{
                            background: "#f0f0f0", color: "#777",
                            fontSize: "9px", fontWeight: 700,
                            padding: "2px 6px", borderRadius: "3px",
                          }}>{listing.condition}</span>
                        </div>
                        <p style={{ margin: "4px 0 0", color: "#aaa", fontSize: "11px", fontFamily: "Georgia, serif" }}>
                          📍 {listing.location || "On Campus"}
                        </p>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "8px" }}>
                        <p style={{ margin: "0 0 6px", fontWeight: 800, color: "#cc0000", fontSize: "15px" }}>
                          ${listing.price}
                        </p>
                        <button className="del-btn" onClick={() => handleDelete(listing.id)}>
                          🗑 Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── Four action cards ── */}
          <div className="dash-grid">

            {/* Role tools */}
            <div className="dash-card" style={{ animationDelay: "0.08s" }}>
              <h3 className="dash-section-h">{isSeller ? "Seller Tools" : "Buyer Tools"}</h3>
              {isSeller ? (
                <>
                  <ActionBtn icon="➕" label="Post New Listing"        to="/sell" />
                  <ActionBtn icon="📦" label="View My Listings"        to="/marketplace" />
                  <ActionBtn icon="💬" label="Messages from Buyers"    to="/support" />
                </>
              ) : (
                <>
                  <ActionBtn icon="🔍" label="Browse All Items"        to="/marketplace" />
                  <ActionBtn icon="❤️"  label="Saved Items"             to="/marketplace" />
                  <ActionBtn icon="🏷️" label="Post an Item to Sell"    to="/sell" />
                </>
              )}
            </div>

            {/* Marketplace */}
            <div className="dash-card" style={{ animationDelay: "0.12s" }}>
              <h3 className="dash-section-h">Marketplace</h3>
              <ActionBtn icon="🛍️" label="Browse Marketplace"         to="/marketplace" />
              <ActionBtn icon="🏷️" label="Sell an Item"                to="/sell" />
              <ActionBtn icon="🆕" label="Newest Listings"             to="/marketplace" />
            </div>

            {/* Account */}
            <div className="dash-card" style={{ animationDelay: "0.16s" }}>
              <h3 className="dash-section-h">Account</h3>
              <ActionBtn icon="🛡️" label="Safety Tips"                 to="/safety" />
              <ActionBtn icon="🆘" label="Contact Support"             to="/support" />
              <ActionBtn icon="🏠" label="Go to Homepage"              to="/" />
            </div>

            {/* Quick links */}
            <div className="dash-card" style={{ animationDelay: "0.2s" }}>
              <h3 className="dash-section-h">Quick Links</h3>
              <ActionBtn icon="📚" label="Browse Books"                to="/marketplace" />
              <ActionBtn icon="💻" label="Browse Electronics"          to="/marketplace" />
              <ActionBtn icon="👕" label="Browse Clothes"              to="/marketplace" />
            </div>
          </div>

          {/* Logout row */}
          <div style={{
            marginTop: "32px", paddingTop: "24px",
            borderTop: "1px solid #e8e8e8",
            display: "flex", justifyContent: "space-between",
            alignItems: "center", flexWrap: "wrap", gap: "12px",
          }}>
            <p style={{ color: "#bbb", fontSize: "12px", fontFamily: "Georgia, serif", margin: 0 }}>
              Logged in as <strong style={{ color: "#999" }}>{currentUser.email}</strong>
            </p>
            <button onClick={handleLogout} style={{
              padding: "9px 22px", background: "transparent",
              border: "1.5px solid #ddd", borderRadius: "6px",
              color: "#888", fontSize: "12px", fontWeight: 700,
              fontFamily: "Georgia, serif", cursor: "pointer",
              transition: "border-color 0.18s, color 0.18s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="#cc0000"; e.currentTarget.style.color="#cc0000"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="#ddd"; e.currentTarget.style.color="#888"; }}
            >
              Log Out
            </button>
          </div>

        </div>
      </main>
    </>
  );
}
