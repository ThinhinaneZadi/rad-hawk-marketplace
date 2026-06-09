// CategorySection.jsx
// Grid of category chips with staggered fade-in and red hover state.

import { useState } from "react";

const CATEGORIES = [
  { icon: "👕", label: "Clothes" },
  { icon: "👟", label: "Shoes" },
  { icon: "📚", label: "Books" },
  { icon: "💻", label: "Electronics" },
  { icon: "🪑", label: "Furniture" },
  { icon: "✏️", label: "School Supplies" },
  { icon: "👜", label: "Accessories" },
  { icon: "⚽", label: "Sports" },
  { icon: "🏠", label: "Home & Kitchen" },
  { icon: "···", label: "More", isMore: true },
];

// Stagger keyframe injected once
const STYLE = `
  @keyframes catFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .cat-chip {
    animation: catFadeUp 0.5s ease both;
  }
`;

export default function CategorySection() {
  const [hovered, setHovered] = useState(null);

  return (
    <>
      <style>{STYLE}</style>

      <section
        id="categories"
        style={{ background: "#fff", padding: "48px 48px 40px" }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* Section heading */}
          <h2
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: "26px",
              color: "#111",
              letterSpacing: "2px",
              margin: "0 0 28px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            Shop by Category
            <div style={{ height: "2px", width: "48px", background: "#cc0000" }} />
          </h2>

          {/* Category grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "12px",
            }}
          >
            {CATEGORIES.map((cat, i) => (
              <a
                key={cat.label}
                href={
                  cat.isMore
                    ? "/marketplace"
                    : `/marketplace?category=${cat.label}`
                }
                className="cat-chip"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  /* Stagger the animation delay based on index */
                  animationDelay: `${i * 0.06}s`,

                  background: hovered === i ? "#cc0000" : "#fff",
                  border: `1.5px solid ${hovered === i ? "#cc0000" : "#e0e0e0"}`,
                  borderRadius: "8px",
                  padding: "20px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "background 0.18s, border-color 0.18s, transform 0.18s, box-shadow 0.18s",
                  transform: hovered === i ? "translateY(-4px)" : "translateY(0)",
                  boxShadow:
                    hovered === i
                      ? "0 6px 20px rgba(204,0,0,0.2)"
                      : "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                <span style={{ fontSize: "28px", lineHeight: 1 }}>
                  {cat.isMore ? (
                    <span
                      style={{
                        fontSize: "20px",
                        letterSpacing: "2px",
                        color: hovered === i ? "#fff" : "#999",
                      }}
                    >
                      •••
                    </span>
                  ) : (
                    cat.icon
                  )}
                </span>

                <span
                  style={{
                    color: hovered === i ? "#fff" : "#222",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.3px",
                    textAlign: "center",
                    fontFamily: "Georgia, serif",
                    transition: "color 0.18s",
                  }}
                >
                  {cat.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
