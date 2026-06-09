// Marketplace.jsx  (src/pages/Marketplace.jsx)
//
// CHANGE FROM PREVIOUS VERSION:
//   Now reads BOTH sources of items:
//     1. itemsData.js        → the original hardcoded demo items
//     2. localStorage        → real listings posted by users via SellItem.jsx
//   They are merged and displayed together in the same grid.

import { useState, useMemo } from "react";
import ItemCard from "../components/ItemCard";
import itemsData from "../data/itemsData";
import { useAuth } from "../context/AuthContext";

const CATEGORIES  = ["All","Electronics","Clothes","Books","Furniture","Shoes","Sports","Accessories","School Supplies","Other"];
const CONDITIONS  = ["All","Like New","Good","Used"];
const SORT_OPTIONS = [
  { label: "Newest First",      value: "newest"     },
  { label: "Price: Low → High", value: "price_asc"  },
  { label: "Price: High → Low", value: "price_desc" },
];

const STYLES = `
  .mkt-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 20px;
  }
  @media (min-width: 1100px) {
    .mkt-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 640px) {
    .mkt-grid            { grid-template-columns: 1fr; }
    .mkt-sidebar         { display: none !important; }
    .mkt-sidebar-btn     { display: none !important; }
    .mkt-main            { padding: 20px 16px !important; }
  }
  .mkt-search-input:focus { border-color: #cc0000 !important; outline: none; }
  .mkt-sort-sel:focus     { border-color: #cc0000 !important; outline: none; }
  .f-chip {
    padding: 5px 10px; font-size: 11px; font-weight: 600;
    border-radius: 5px; cursor: pointer;
    transition: all 0.15s; letter-spacing: 0.3px;
    border: 1.5px solid #e0e0e0; background: #fff; color: #555;
  }
  .f-chip:hover  { background: #fff0f0; color: #cc0000; border-color: #cc0000; }
  .f-chip.active { background: #cc0000; color: #fff;    border-color: #cc0000; }
  .empty-btn {
    margin-top: 20px; padding: 11px 28px;
    background: #cc0000; color: #fff; border: none;
    border-radius: 6px; font-weight: 700; font-size: 13px;
    letter-spacing: 0.5px; cursor: pointer;
    transition: background 0.18s, transform 0.15s;
  }
  .empty-btn:hover { background: #a50000; transform: translateY(-2px); }

  /* "User posted" badge on listings */
  .user-badge {
    display: inline-block;
    background: #fff3e0;
    color: #e65100;
    font-size: 8px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-left: 4px;
    vertical-align: middle;
  }
`;

export default function Marketplace() {
  const { getListings } = useAuth();

  const [search,    setSearch]    = useState("");
  const [category,  setCategory]  = useState("All");
  const [condition, setCondition] = useState("All");
  const [minPrice,  setMinPrice]  = useState("");
  const [maxPrice,  setMaxPrice]  = useState("");
  const [sort,      setSort]      = useState("newest");
  const [sideOpen,  setSideOpen]  = useState(true);

  // ── Merge hardcoded items + user-posted items ────────────────
  // getListings() reads from localStorage every render,
  // so newly posted items appear immediately without a page refresh.
  const allItems = useMemo(() => {
    const userListings = getListings();

    // User listings go FIRST so they appear at the top (newest)
    return [...userListings, ...itemsData];
  }, []);   // eslint-disable-line

  // ── Filter + sort ────────────────────────────────────────────
  const filtered = useMemo(() => {
    let r = [...allItems];

    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(i =>
        i.title.toLowerCase().includes(q)    ||
        i.category.toLowerCase().includes(q) ||
        i.seller.toLowerCase().includes(q)
      );
    }
    if (category  !== "All") r = r.filter(i => i.category  === category);
    if (condition !== "All") r = r.filter(i => i.condition === condition);
    if (minPrice  !== "")    r = r.filter(i => i.price >= Number(minPrice));
    if (maxPrice  !== "")    r = r.filter(i => i.price <= Number(maxPrice));

    if (sort === "price_asc")  r.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") r.sort((a, b) => b.price - a.price);
    // "newest" keeps user listings first (they were added at the front above)

    return r;
  }, [search, category, condition, minPrice, maxPrice, sort, allItems]);

  const reset = () => {
    setSearch(""); setCategory("All"); setCondition("All");
    setMinPrice(""); setMaxPrice(""); setSort("newest");
  };

  const userListingCount = getListings().length;

  return (
    <>
      <style>{STYLES}</style>

      <main className="mkt-main" style={{ padding: "40px 48px", maxWidth: "1240px", margin: "0 auto" }}>

        {/* Page header */}
        <div style={{ marginBottom: "28px" }}>
          <p style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "13px", letterSpacing: "4px",
            color: "#cc0000", textTransform: "uppercase", margin: "0 0 6px",
          }}>
            LaGuardia Community College
          </p>
          <h1 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "clamp(36px, 5vw, 60px)",
            lineHeight: 0.95, color: "#111", margin: "0 0 10px",
          }}>
            MARKETPLACE
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <p style={{ color: "#777", fontFamily: "Georgia, serif", fontSize: "15px", margin: 0 }}>
              {filtered.length} listing{filtered.length !== 1 ? "s" : ""} available
            </p>
            {/* Show how many are user-posted */}
            {userListingCount > 0 && (
              <span style={{
                background: "#fff3e0", color: "#e65100",
                fontSize: "11px", fontWeight: 700,
                padding: "3px 10px", borderRadius: "20px",
              }}>
                🆕 {userListingCount} student-posted
              </span>
            )}
          </div>
        </div>

        {/* Search + sort + filter toggle */}
        <div style={{
          display: "flex", gap: "12px", marginBottom: "24px",
          alignItems: "center", flexWrap: "wrap",
        }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 260px" }}>
            <span style={{
              position: "absolute", left: "14px", top: "50%",
              transform: "translateY(-50%)", fontSize: "15px", color: "#aaa",
            }}>🔍</span>
            <input
              type="text"
              placeholder="Search items, categories, sellers…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="mkt-search-input"
              style={{
                width: "100%", padding: "12px 14px 12px 40px",
                fontSize: "14px", border: "2px solid #e8e8e8",
                borderRadius: "8px", fontFamily: "Georgia, serif",
                boxSizing: "border-box", transition: "border-color 0.2s",
              }}
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="mkt-sort-sel"
            style={{
              padding: "12px 14px", fontSize: "13px",
              border: "2px solid #e8e8e8", borderRadius: "8px",
              background: "#fff", color: "#333",
              fontFamily: "Georgia, serif", transition: "border-color 0.2s",
            }}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Filter toggle */}
          <button
            className="mkt-sidebar-btn"
            onClick={() => setSideOpen(o => !o)}
            style={{
              padding: "12px 16px", fontSize: "12px", fontWeight: 700,
              letterSpacing: "1px", textTransform: "uppercase",
              border: "2px solid #111", borderRadius: "8px",
              background: sideOpen ? "#111" : "#fff",
              color:      sideOpen ? "#fff" : "#111",
              cursor: "pointer", transition: "all 0.18s", whiteSpace: "nowrap",
            }}
          >
            {sideOpen ? "✕ Hide Filters" : "⊞ Show Filters"}
          </button>
        </div>

        {/* Body: sidebar + grid */}
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>

          {/* Sidebar */}
          {sideOpen && (
            <aside className="mkt-sidebar" style={{
              width: "220px", flexShrink: 0,
              background: "#fff", border: "2px solid #ebebeb",
              borderRadius: "10px", padding: "22px 18px",
              position: "sticky", top: "80px",
            }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: "14px",
              }}>
                <h3 style={{
                  fontFamily: "'Bebas Neue', Impact, sans-serif",
                  fontSize: "18px", letterSpacing: "1.5px", color: "#111", margin: 0,
                }}>FILTERS</h3>
                <button
                  onClick={reset}
                  style={{
                    background: "none", border: "none", color: "#cc0000",
                    fontSize: "11px", fontWeight: 700, cursor: "pointer", padding: 0,
                  }}
                >Reset All</button>
              </div>
              <div style={{ height: "2px", background: "#cc0000", marginBottom: "18px" }} />

              <FilterGroup label="Category">
                {CATEGORIES.map(c => (
                  <span key={c}
                    className={`f-chip ${category === c ? "active" : ""}`}
                    onClick={() => setCategory(c)}
                  >{c}</span>
                ))}
              </FilterGroup>

              <FilterGroup label="Condition">
                {CONDITIONS.map(c => (
                  <span key={c}
                    className={`f-chip ${condition === c ? "active" : ""}`}
                    onClick={() => setCondition(c)}
                  >{c}</span>
                ))}
              </FilterGroup>

              <FilterGroup label="Price Range ($)">
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input type="number" placeholder="Min" value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    style={priceStyle}
                    onFocus={e => (e.target.style.borderColor = "#cc0000")}
                    onBlur={e  => (e.target.style.borderColor = "#e0e0e0")}
                  />
                  <span style={{ color: "#bbb", fontSize: "12px" }}>–</span>
                  <input type="number" placeholder="Max" value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    style={priceStyle}
                    onFocus={e => (e.target.style.borderColor = "#cc0000")}
                    onBlur={e  => (e.target.style.borderColor = "#e0e0e0")}
                  />
                </div>
              </FilterGroup>
            </aside>
          )}

          {/* Grid */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px", fontFamily: "Georgia, serif" }}>
                <div style={{ fontSize: "52px", marginBottom: "16px" }}>🔍</div>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "#333", marginBottom: "8px" }}>
                  No listings match your filters
                </p>
                <p style={{ fontSize: "14px", color: "#999" }}>
                  Try widening your search or clearing some filters.
                </p>
                <button className="empty-btn" onClick={reset}>Clear All Filters</button>
              </div>
            ) : (
              <div className="mkt-grid">
                {filtered.map(item => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <p style={{
        fontFamily: "'Bebas Neue', Impact, sans-serif",
        fontSize: "13px", letterSpacing: "1.5px", color: "#111",
        margin: "0 0 8px", textTransform: "uppercase",
      }}>{label}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
        {children}
      </div>
    </div>
  );
}

const priceStyle = {
  width: "66px", padding: "7px 9px", fontSize: "12px",
  border: "1.5px solid #e0e0e0", borderRadius: "6px", outline: "none",
  fontFamily: "Georgia, serif", transition: "border-color 0.2s",
};
