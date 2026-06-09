// Home.jsx  (src/pages/Home.jsx)
//
// FIX: Featured Listings section now uses:
//   - itemsData.js  (same data source as Marketplace)
//   - ItemCard      (same card component as Marketplace)
// This means images display correctly — no more emojis or broken images.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import hawkImg from "../assets/images/radhawk.png";

// ── Import the REAL data and REAL card component ──────────────
import itemsData from "../data/itemsData";     // same file Marketplace uses
import ItemCard  from "../components/ItemCard"; // same card Marketplace uses

// Show the first 6 items as "featured"
// Change this number to show more or fewer cards
const FEATURED_ITEMS = itemsData.slice(0, 6);

// ── Inline keyframes ───────────────────────────────────────────
const STYLES = `
  @keyframes heroEnter {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes floatHawk {
    0%, 100% { transform: scale(1.04) translateY(0); }
    50%       { transform: scale(1.04) translateY(-16px); }
  }
  @keyframes howIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Hero buttons */
  .hero-btn-red {
    background: #cc0000; color: #fff;
    padding: 14px 34px; font-size: 13px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    text-decoration: none; border: 2px solid #cc0000;
    display: inline-block;
    transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
  }
  .hero-btn-red:hover {
    background: #a50000; border-color: #a50000;
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(204,0,0,0.35);
  }
  .hero-btn-ghost {
    background: transparent; color: #111;
    padding: 14px 28px; font-size: 13px; font-weight: 600;
    letter-spacing: 1px; text-transform: uppercase;
    text-decoration: none; border: 2px solid #111;
    display: inline-block;
    transition: background 0.18s, color 0.18s, transform 0.15s;
  }
  .hero-btn-ghost:hover {
    background: #111; color: #fff; transform: translateY(-3px);
  }
  .hero-btn-dark {
    background: #111; color: #fff;
    padding: 14px 28px; font-size: 13px; font-weight: 600;
    letter-spacing: 1px; text-transform: uppercase;
    text-decoration: none; border: 2px solid #111;
    display: inline-block;
    transition: background 0.18s, transform 0.15s;
  }
  .hero-btn-dark:hover {
    background: #333; transform: translateY(-3px);
  }

  /* How it works card */
  .how-card {
    background: #fff;
    border: 2px solid #ebebeb;
    border-radius: 10px;
    padding: 32px 24px;
    text-align: center;
    flex: 1;
    min-width: 180px;
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
    animation: howIn 0.6s ease both;
  }
  .how-card:hover {
    border-color: #cc0000;
    transform: translateY(-5px);
    box-shadow: 0 10px 28px rgba(204,0,0,0.12);
  }

  /* Stats under hero text */
  .stat-box { display: flex; flex-direction: column; }
  .stat-n {
    font-family: 'Bebas Neue', Impact, sans-serif;
    font-size: 32px; color: #cc0000; line-height: 1;
  }
  .stat-l {
    font-size: 11px; color: #888;
    letter-spacing: 1px; text-transform: uppercase; margin-top: 2px;
  }

  /* Hide red panel on small screens */
  @media (max-width: 700px) {
    .hero-right  { display: none !important; }
    .hero-slash  { display: none !important; }
    .hero-left   { padding: 40px 24px !important; max-width: 100% !important; }
    .home-section { padding: 32px 20px !important; }
  }
`;

export default function Home() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  return (
    <>
      <style>{STYLES}</style>

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section style={{
        position: "relative",
        background: "#fff",
        minHeight: "520px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        borderBottom: "3px solid #e8e8e8",
      }}>
        {/* Red right panel */}
        <div className="hero-right" style={{
          position: "absolute", right: 0, top: 0, bottom: 0,
          width: "52%",
          background: "linear-gradient(135deg, #cc0000 0%, #8b0000 100%)",
          clipPath: "polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)",
          zIndex: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}>
          <img
            src={hawkImg}
            alt="Rad Hawk mascot"
            style={{
              width: "82%",
              objectFit: "contain",
              opacity: 0.93,
              filter: "drop-shadow(-8px 12px 28px rgba(0,0,0,0.55))",
              animation: "floatHawk 4s ease-in-out infinite",
            }}
          />
        </div>

        {/* Diagonal slash accent */}
        <div className="hero-slash" style={{
          position: "absolute", left: "44%", top: 0, bottom: 0,
          width: "6px", background: "#cc0000",
          transform: "skewX(-8deg)", zIndex: 2,
        }} />

        {/* Left text content */}
        <div
          className="hero-left"
          style={{
            position: "relative", zIndex: 3,
            padding: "60px 48px",
            maxWidth: "560px",
            opacity: visible ? 1 : 0,
            animation: visible ? "heroEnter 0.85s cubic-bezier(.22,1,.36,1) both" : "none",
          }}
        >
          <p style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "13px", letterSpacing: "4px",
            color: "#cc0000", margin: "0 0 12px", textTransform: "uppercase",
          }}>
            LaGuardia Community College
          </p>

          <h1 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "clamp(52px, 8vw, 88px)",
            lineHeight: 0.9, color: "#111",
            margin: "0 0 8px", letterSpacing: "1px",
          }}>
            LA GUARDIA<br />
            <span style={{ color: "#cc0000" }}>RAD HAWK</span><br />
            MARKETPLACE
          </h1>

          <p style={{
            color: "#555", fontSize: "15px", lineHeight: 1.7,
            margin: "18px 0 32px", maxWidth: "380px",
            fontFamily: "Georgia, serif",
          }}>
            The official student marketplace for LaGuardia. Buy, sell, and connect
            with your campus community — safely and easily.
          </p>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/marketplace" className="hero-btn-red">Shop Now →</Link>
            <Link to="/sell"        className="hero-btn-ghost">Sell an Item</Link>
            <Link to="/auth"        className="hero-btn-dark">Join Marketplace</Link>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "28px", marginTop: "32px", flexWrap: "wrap" }}>
            <div className="stat-box">
              <span className="stat-n">19+</span>
              <span className="stat-l">Active Listings</span>
            </div>
            <div className="stat-box">
              <span className="stat-n">9</span>
              <span className="stat-l">Categories</span>
            </div>
            <div className="stat-box">
              <span className="stat-n">100%</span>
              <span className="stat-l">Campus-Based</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="home-section" style={{
        background: "#fafafa",
        padding: "56px 48px",
        borderBottom: "1px solid #ebebeb",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "26px", color: "#111", letterSpacing: "2px",
            margin: "0 0 36px",
            display: "flex", alignItems: "center", gap: "12px",
          }}>
            How It Works
            <div style={{ height: "2px", width: "48px", background: "#cc0000" }} />
          </h2>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {[
              { step: "01", title: "Create an Account",  body: "Sign up as a buyer or seller in under a minute. No credit card needed." },
              { step: "02", title: "Browse or List",     body: "Search student items or post your own listing in seconds." },
              { step: "03", title: "Connect Safely",     body: "Message the seller and arrange a campus meet-up in a safe public spot." },
              { step: "04", title: "Buy or Sell",        body: "Complete the exchange and build your campus reputation." },
            ].map((card, i) => (
              <div
                key={card.step}
                className="how-card"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div style={{
                  display: "inline-flex",
                  alignItems: "center", justifyContent: "center",
                  width: "44px", height: "44px",
                  background: "#cc0000", borderRadius: "50%",
                  color: "#fff",
                  fontFamily: "'Bebas Neue', Impact, sans-serif",
                  fontSize: "20px", letterSpacing: "1px",
                  marginBottom: "16px",
                }}>
                  {card.step}
                </div>
                <h3 style={{
                  fontFamily: "'Bebas Neue', Impact, sans-serif",
                  fontSize: "18px", letterSpacing: "1px",
                  color: "#111", margin: "0 0 10px",
                }}>
                  {card.title}
                </h3>
                <p style={{
                  color: "#666", fontSize: "13px",
                  lineHeight: 1.7, fontFamily: "Georgia, serif",
                }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURED LISTINGS
          Uses real itemsData + real ItemCard component
          — same as the Marketplace page
      ══════════════════════════════════════════ */}
      <section className="home-section" style={{ padding: "56px 48px 72px", background: "#fff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* Section header */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: "28px",
          }}>
            <h2 style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: "26px", color: "#111", letterSpacing: "2px", margin: 0,
              display: "flex", alignItems: "center", gap: "12px",
            }}>
              Featured Listings
              <div style={{ height: "2px", width: "48px", background: "#cc0000" }} />
            </h2>

            <Link to="/marketplace" style={{
              color: "#cc0000", fontSize: "13px", fontWeight: 700,
              textDecoration: "none", letterSpacing: "0.5px",
              transition: "letter-spacing 0.18s",
            }}
              onMouseEnter={e => e.currentTarget.style.letterSpacing = "1.5px"}
              onMouseLeave={e => e.currentTarget.style.letterSpacing = "0.5px"}
            >
              View All →
            </Link>
          </div>

          {/*
            THE FIX IS HERE:
            Instead of a custom card with emojis, we use the real ItemCard
            component with real itemsData — exactly like Marketplace.jsx does.

            itemsData.slice(0, 6) takes the first 6 items from the data file.
            You can change 6 to any number you want.
          */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
          }}>
            {FEATURED_ITEMS.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          BOTTOM BANNER
      ══════════════════════════════════════════ */}
      <section style={{
        background: "#111",
        padding: "56px 48px",
        textAlign: "center",
        borderTop: "4px solid #cc0000",
      }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: "clamp(28px, 4vw, 48px)",
          color: "#fff", letterSpacing: "2px", margin: "0 0 14px",
        }}>
          Ready to List Your First Item?
        </h2>
        <p style={{
          color: "#888", fontFamily: "Georgia, serif",
          fontSize: "15px", lineHeight: 1.7,
          maxWidth: "480px", margin: "0 auto 32px",
        }}>
          Join hundreds of LaGuardia students already buying and selling on campus.
          It's free, fast, and safe.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/auth" className="hero-btn-red">Create Account →</Link>
          <Link
            to="/marketplace"
            style={{
              display: "inline-block",
              background: "transparent", color: "#fff",
              border: "2px solid rgba(255,255,255,0.45)",
              padding: "13px 26px", fontWeight: 600, fontSize: "13px",
              letterSpacing: "1px", textTransform: "uppercase",
              textDecoration: "none",
              transition: "border-color 0.18s, transform 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "#fff";
              e.currentTarget.style.transform   = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)";
              e.currentTarget.style.transform   = "translateY(0)";
            }}
          >
            Browse Listings
          </Link>
        </div>
      </section>
    </>
  );
}
