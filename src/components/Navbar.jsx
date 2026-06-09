// Navbar.jsx  (src/components/Navbar.jsx)
// What changed from your old version:
//   1. Imports useAuth from AuthContext
//   2. If logged OUT  → shows red "Login / Register" button
//   3. If logged IN   → shows avatar circle + first name + Logout button

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BASE_LINKS = [
  { label: "Home",        to: "/" },
  { label: "Marketplace", to: "/marketplace" },
  { label: "Safety",      to: "/safety" },
  { label: "Support",     to: "/support" },
];

export default function Navbar() {
  const { pathname }            = useLocation();
  const navigate                = useNavigate();
  const { currentUser, logout } = useAuth();   // ← reads from AuthContext

  const handleLogout = () => {
    logout();          // clears localStorage session
    navigate("/");     // sends user back to homepage
  };

  // Show only the first name in the nav (e.g. "Samia" not "Samia Shahid")
  const firstName = currentUser?.fullName?.split(" ")[0] || "";

  return (
    <nav>
      {/* Brand logo */}
      <Link to="/" style={{ textDecoration: "none" }}>
        <h2>RAD <span>HAWK</span></h2>
      </Link>

      {/* Navigation links */}
      <ul>
        {/* Regular page links — same as before */}
        {BASE_LINKS.map(({ label, to }) => (
          <li key={to}>
            <Link to={to} className={pathname === to ? "nav-active" : ""}>
              {label}
            </Link>
          </li>
        ))}

        {/* This part changes based on login state */}
        {currentUser ? (
          // ── LOGGED IN: show avatar + name + logout ──
          <>
            {/* Avatar circle + first name → links to dashboard */}
            <li>
              <Link
                to="/dashboard"
                className={pathname === "/dashboard" ? "nav-active" : ""}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                {/* Small red circle with first letter of name */}
                <span style={{
                  display:         "inline-flex",
                  alignItems:      "center",
                  justifyContent:  "center",
                  width:           "24px",
                  height:          "24px",
                  borderRadius:    "50%",
                  background:      "#cc0000",
                  color:           "#fff",
                  fontSize:        "11px",
                  fontWeight:      700,
                  flexShrink:      0,
                }}>
                  {firstName.charAt(0).toUpperCase()}
                </span>
                {firstName}
              </Link>
            </li>

            {/* Logout button */}
            <li>
              <button
                onClick={handleLogout}
                style={{
                  background:    "transparent",
                  border:        "1.5px solid #444",
                  color:         "#aaa",
                  borderRadius:  "4px",
                  padding:       "5px 13px",
                  fontSize:      "12px",
                  fontWeight:    600,
                  fontFamily:    "Georgia, serif",
                  letterSpacing: "0.3px",
                  transition:    "border-color 0.18s, color 0.18s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "#cc0000";
                  e.currentTarget.style.color       = "#fff";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#444";
                  e.currentTarget.style.color       = "#aaa";
                }}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          // ── LOGGED OUT: show red Login / Register button ──
          <li>
            <Link
              to="/auth"
              className="nav-login-btn"
              style={{ marginLeft: "6px" }}
            >
              Login / Register
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}