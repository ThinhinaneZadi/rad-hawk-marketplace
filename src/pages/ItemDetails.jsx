// ItemDetails.jsx  (src/pages/ItemDetails.jsx)
//
// FIX: Now searches TWO sources to find an item by ID:
//   1. itemsData.js          — the original hardcoded items (numeric IDs: 1, 2, 3…)
//   2. localStorage          — user-posted listings (string IDs: "user_1234567890")
//
// WHY THE OLD VERSION BROKE:
//   The old code did:  itemsData.find(item => item.id === Number(id))
//   Number("user_1234567890") returns NaN, so the find always failed for
//   user-posted items, showing "Item Not Found" even though the item existed.
//
// THE FIX:
//   Try to find the item in itemsData first (using Number conversion).
//   If not found there, search localStorage listings (using string comparison).

import { useParams, Link, useNavigate } from "react-router-dom";
import itemsData from "../data/itemsData";

// ── Condition badge colors ─────────────────────────────────────
const CONDITION_COLORS = {
  "Like New": { bg: "#e8f5e9", text: "#2e7d32" },
  "Good":     { bg: "#fff8e1", text: "#f57f17" },
  "Used":     { bg: "#fce4ec", text: "#c62828" },
};

// ── Helper: load user-posted listings from localStorage ────────
// This is the same logic used in AuthContext — reads the "rh_listings" key
function loadUserListings() {
  try {
    return JSON.parse(localStorage.getItem("rh_listings")) || [];
  } catch {
    return [];
  }
}

// ── Helper: find item by ID from both sources ──────────────────
// Returns the item object, or null if not found anywhere
function findItem(id) {
  // 1. Try original itemsData first (IDs are numbers: 1, 2, 3…)
  //    We compare against Number(id) because URL params are always strings
  const fromData = itemsData.find(item => item.id === Number(id));
  if (fromData) return fromData;

  // 2. Try localStorage listings (IDs are strings: "user_1234567890")
  //    We compare as strings because those IDs were never numbers
  const fromStorage = loadUserListings().find(item => item.id === id);
  if (fromStorage) return fromStorage;

  // 3. Not found in either source
  return null;
}

export default function ItemDetails() {
  const { id }    = useParams();   // the :id from the URL, e.g. "1" or "user_1234567890"
  const navigate  = useNavigate();

  // Find the item using the combined search
  const item = findItem(id);

  // ── Condition badge style (falls back to grey if unknown) ─────
  const condStyle = CONDITION_COLORS[item?.condition] ?? { bg: "#f5f5f5", text: "#666" };

  // ── Item not found screen ──────────────────────────────────────
  if (!item) {
    return (
      <main style={{ padding: "80px 48px", textAlign: "center" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔍</div>
        <h1 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: "48px", color: "#111", marginBottom: "12px",
        }}>
          Item Not Found
        </h1>
        <p style={{
          color: "#777", fontFamily: "Georgia, serif",
          marginBottom: "28px", fontSize: "15px", lineHeight: 1.7,
        }}>
          This listing may have been removed or doesn't exist.
        </p>
        <Link
          to="/marketplace"
          style={{
            background: "#cc0000", color: "#fff",
            padding: "12px 28px", textDecoration: "none",
            fontWeight: 700, fontSize: "13px", letterSpacing: "1px",
            textTransform: "uppercase", borderRadius: "4px",
            display: "inline-block",
            transition: "background 0.18s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#a50000"}
          onMouseLeave={e => e.currentTarget.style.background = "#cc0000"}
        >
          ← Back to Marketplace
        </Link>
      </main>
    );
  }

  // ── Decide which image source to use ──────────────────────────
  // Original items have an `image` property that is an imported asset URL.
  // User-posted items have an `image` property that is a base64 data URL string
  // (stored from the FileReader in SellItem.jsx).
  // Both cases are just a string URL, so we can use them the same way.
  const imageSrc = item.image || null;

  // ── Full item details page ─────────────────────────────────────
  return (
    <main style={{ padding: "48px", maxWidth: "1100px", margin: "0 auto" }}>

      {/* Breadcrumb navigation */}
      <div style={{
        marginBottom: "28px",
        display: "flex", alignItems: "center", gap: "8px",
      }}>
        <Link
          to="/marketplace"
          style={{
            color: "#cc0000", fontSize: "12px", fontWeight: 700,
            textDecoration: "none", letterSpacing: "0.5px",
            textTransform: "uppercase",
            transition: "color 0.18s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#a50000"}
          onMouseLeave={e => e.currentTarget.style.color = "#cc0000"}
        >
          ← Marketplace
        </Link>
        <span style={{ color: "#ccc" }}>/</span>
        <span style={{
          color: "#999", fontSize: "12px",
          textTransform: "uppercase", letterSpacing: "0.5px",
        }}>
          {item.category}
        </span>

        {/* Extra breadcrumb for user-posted items */}
        {item.isUserListing && (
          <>
            <span style={{ color: "#ccc" }}>/</span>
            <span style={{
              background: "#fff3e0", color: "#e65100",
              fontSize: "10px", fontWeight: 700,
              padding: "2px 8px", borderRadius: "10px",
              letterSpacing: "0.5px",
            }}>
              Student Listed
            </span>
          </>
        )}
      </div>

      {/* ── Main detail card ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0",
        background: "#fff",
        border: "2px solid #ebebeb",
        borderRadius: "12px",
        overflow: "hidden",
      }}>

        {/* LEFT — image */}
        <div style={{
          background: "#f7f7f7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          borderRight: "2px solid #f0f0f0",
          overflow: "hidden",
          position: "relative",
        }}>
          {imageSrc ? (
            // Show the actual image — works for both imported assets and base64
            <img
              src={imageSrc}
              alt={item.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                minHeight: "400px",
              }}
            />
          ) : (
            // Fallback if somehow no image was saved
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              color: "#ccc", gap: "8px",
            }}>
              <span style={{ fontSize: "48px" }}>📦</span>
              <span style={{ fontSize: "13px", fontFamily: "Georgia, serif" }}>No image</span>
            </div>
          )}
        </div>

        {/* RIGHT — details */}
        <div style={{
          padding: "40px 40px 40px 40px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}>

          {/* Category + condition badges */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span style={{
              background: "#f0f0f0", color: "#555",
              fontSize: "10px", fontWeight: 700,
              padding: "4px 10px", borderRadius: "4px",
              textTransform: "uppercase", letterSpacing: "0.5px",
            }}>
              {item.category}
            </span>
            <span style={{
              background: condStyle.bg, color: condStyle.text,
              fontSize: "10px", fontWeight: 700,
              padding: "4px 10px", borderRadius: "4px",
              textTransform: "uppercase", letterSpacing: "0.4px",
            }}>
              {item.condition}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "clamp(32px, 4vw, 48px)",
            lineHeight: 1, color: "#111", margin: 0, letterSpacing: "1px",
          }}>
            {item.title}
          </h1>

          {/* Price */}
          <p style={{
            fontSize: "36px", fontWeight: 800,
            color: "#cc0000", margin: 0,
          }}>
            ${item.price}
          </p>

          {/* Description — shown if it exists */}
          {item.description ? (
            <p style={{
              fontFamily: "Georgia, serif",
              color: "#555", fontSize: "14px",
              lineHeight: 1.75, margin: 0,
            }}>
              {item.description}
            </p>
          ) : (
            <p style={{
              fontFamily: "Georgia, serif",
              color: "#bbb", fontSize: "14px",
              lineHeight: 1.75, margin: 0, fontStyle: "italic",
            }}>
              No description provided.
            </p>
          )}

          {/* Divider */}
          <div style={{ height: "1px", background: "#f0f0f0" }} />

          {/* Meta info rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

            {/* Seller */}
            <MetaRow label="Seller">
              {item.sellerName
                ? `${item.sellerName} (${item.seller})`  // user-posted: shows full name
                : item.seller}                            // original: just shows @handle
            </MetaRow>

            {/* Meet-up location */}
            <MetaRow label="Meet-up Location">
              📍 {item.location || "On Campus"}
            </MetaRow>

            {/* Posted */}
            <MetaRow label="Posted">
              {item.posted || "Recently"}
            </MetaRow>

            {/* For user-posted items: show a contact email if available */}
            {item.isUserListing && item.sellerEmail && (
              <MetaRow label="Contact Email">
                <a
                  href={`mailto:${item.sellerEmail}`}
                  style={{ color: "#cc0000", textDecoration: "none", fontWeight: 600 }}
                >
                  {item.sellerEmail}
                </a>
              </MetaRow>
            )}
          </div>

          {/* CTA buttons */}
          <div style={{
            display: "flex", gap: "12px",
            marginTop: "8px", flexWrap: "wrap",
          }}>
            <Link
              to={`/contact-seller?item=${item.id}`}
              style={{
                background: "#cc0000", color: "#fff",
                padding: "14px 28px", fontWeight: 700,
                fontSize: "13px", letterSpacing: "1.5px",
                textDecoration: "none", textTransform: "uppercase",
                border: "2px solid #cc0000",
                transition: "background 0.18s, transform 0.15s",
                display: "inline-block",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#a50000";
                e.currentTarget.style.transform  = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "#cc0000";
                e.currentTarget.style.transform  = "translateY(0)";
              }}
            >
              Contact Seller →
            </Link>

            <button
              onClick={() => navigate(-1)}
              style={{
                background: "transparent", color: "#111",
                border: "2px solid #111",
                padding: "14px 22px", fontWeight: 600,
                fontSize: "13px", letterSpacing: "1px",
                textTransform: "uppercase", cursor: "pointer",
                transition: "background 0.18s, color 0.18s, transform 0.15s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#111";
                e.currentTarget.style.color      = "#fff";
                e.currentTarget.style.transform  = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color      = "#111";
                e.currentTarget.style.transform  = "translateY(0)";
              }}
            >
              ← Go Back
            </button>
          </div>

        </div>
      </div>

      {/* Responsive: stack on mobile */}
      <style>{`
        @media (max-width: 700px) {
          main > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </main>
  );
}

// ── Small helper: one label + value row ────────────────────────
function MetaRow({ label, children }) {
  return (
    <div style={{ display: "flex", gap: "8px", fontSize: "13px", alignItems: "flex-start" }}>
      <span style={{ color: "#aaa", fontWeight: 600, minWidth: "140px", flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ color: "#333", fontFamily: "Georgia, serif" }}>
        {children}
      </span>
    </div>
  );
}
