// ItemCard.jsx
// Reusable card for marketplace grid.
// Hover: border turns red, card lifts, "Contact Seller" button slides up.
// No extra libraries — CSS transitions only.

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CONDITION_COLORS = {
  "Like New": { bg: "#e8f5e9", text: "#2e7d32" },
  Good:       { bg: "#fff8e1", text: "#f57f17" },
  Used:       { bg: "#fce4ec", text: "#c62828" },
};

export default function ItemCard({ item }) {
  const [liked,   setLiked]   = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const condStyle =
    CONDITION_COLORS[item.condition] ?? { bg: "#f5f5f5", text: "#666" };

  return (
    <div
      onClick={() => navigate(`/item/${item.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: hovered ? "2px solid #cc0000" : "2px solid #ebebeb",
        borderRadius: "10px",
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",

        /* Lift effect */
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 12px 32px rgba(204,0,0,0.14)"
          : "0 2px 8px rgba(0,0,0,0.06)",
        transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.18s",
      }}
    >
      {/* ── Image area ── */}
      <div
        style={{
          background: "#f7f7f7",
          height: "162px",
          position: "relative",
          borderBottom: "1px solid #f0f0f0",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <img
          src={item.image}
          alt={item.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            /* Slight zoom on hover for a lively feel */
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.35s ease",
          }}
        />

        {/* Heart / wishlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked((l) => !l);
          }}
          title={liked ? "Remove from wishlist" : "Save to wishlist"}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "rgba(255,255,255,0.92)",
            border: "none",
            borderRadius: "50%",
            width: "34px",
            height: "34px",
            cursor: "pointer",
            fontSize: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            transition: "transform 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {liked ? "❤️" : "🤍"}
        </button>

        {/* Posted badge */}
        <span
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(0,0,0,0.55)",
            color: "#fff",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.4px",
            padding: "3px 7px",
            borderRadius: "4px",
            textTransform: "uppercase",
          }}
        >
          {item.posted}
        </span>
      </div>

      {/* ── Info ── */}
      <div
        style={{
          padding: "13px 15px 15px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          flex: 1,
        }}
      >
        {/* Title + price */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          <h3
            style={{
              color: "#111",
              margin: 0,
              fontSize: "13px",
              fontWeight: 700,
              lineHeight: 1.3,
              flex: 1,
            }}
          >
            {item.title}
          </h3>
          <span
            style={{
              color: "#cc0000",
              fontWeight: 800,
              fontSize: "16px",
              flexShrink: 0,
            }}
          >
            ${item.price}
          </span>
        </div>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              background: "#f0f0f0",
              color: "#555",
              fontSize: "9px",
              fontWeight: 700,
              padding: "3px 7px",
              borderRadius: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {item.category}
          </span>
          <span
            style={{
              background: condStyle.bg,
              color: condStyle.text,
              fontSize: "9px",
              fontWeight: 700,
              padding: "3px 7px",
              borderRadius: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
            }}
          >
            {item.condition}
          </span>
        </div>

        {/* Seller + location */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: "4px",
          }}
        >
          <span style={{ color: "#aaa", fontSize: "11px" }}>{item.seller}</span>
          <span style={{ color: "#bbb", fontSize: "10px" }}>📍 {item.location}</span>
        </div>
      </div>

      {/* ── Contact Seller — slides up on hover ── */}
      <div
        style={{
          maxHeight: hovered ? "44px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.22s ease",
          borderTop: hovered ? "1px solid #f0f0f0" : "none",
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/contact-seller?item=${item.id}`);
          }}
          style={{
            width: "100%",
            padding: "11px",
            background: "#cc0000",
            color: "#fff",
            border: "none",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "background 0.18s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#a50000")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#cc0000")}
        >
          Contact Seller →
        </button>
      </div>
    </div>
  );
}
