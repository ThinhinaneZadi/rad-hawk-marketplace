// Hero.jsx
// Homepage hero section.
// Animations: fade-in on mount (JS class toggle), floating hawk image (CSS keyframe).
// No extra libraries — pure CSS + inline styles.

import { useEffect, useState } from "react";
import hawkImg from "../assets/images/radhawk.png";

// Floating animation is injected once as a <style> tag so we keep it
// self-contained inside this component without needing a separate CSS file.
const FLOAT_STYLE = `
  @keyframes floatHawk {
    0%, 100% { transform: scale(1.05) translateY(0px); }
    50%       { transform: scale(1.05) translateY(-14px); }
  }
  @keyframes heroFadeIn {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hero-content-enter {
    animation: heroFadeIn 0.85s cubic-bezier(.22,1,.36,1) both;
  }
  .hawk-float {
    animation: floatHawk 4s ease-in-out infinite;
  }
  .hero-btn-primary {
    background: #cc0000;
    color: #fff;
    padding: 14px 32px;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 1.5px;
    text-decoration: none;
    text-transform: uppercase;
    border: 2px solid #cc0000;
    display: inline-block;
    transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
  }
  .hero-btn-primary:hover {
    background: #a50000;
    border-color: #a50000;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(204,0,0,0.35);
  }
  .hero-btn-outline {
    background: transparent;
    color: #111;
    border: 2px solid #111;
    padding: 14px 28px;
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 1px;
    text-decoration: none;
    text-transform: uppercase;
    display: inline-block;
    transition: background 0.18s, color 0.18s, transform 0.15s;
  }
  .hero-btn-outline:hover {
    background: #111;
    color: #fff;
    transform: translateY(-3px);
  }
  /* Stat badge row */
  .hero-stats {
    display: flex;
    gap: 24px;
    margin-top: 32px;
    flex-wrap: wrap;
  }
  .hero-stat {
    display: flex;
    flex-direction: column;
  }
  .hero-stat-number {
    font-family: 'Bebas Neue', Impact, sans-serif;
    font-size: 28px;
    color: #cc0000;
    line-height: 1;
  }
  .hero-stat-label {
    font-size: 11px;
    color: #777;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-top: 2px;
  }
`;

export default function Hero() {
  const [visible, setVisible] = useState(false);

  // Small delay so the CSS animation actually plays on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Inject keyframes once */}
      <style>{FLOAT_STYLE}</style>

      <section
        style={{
          position: "relative",
          background: "#fff",
          minHeight: "500px",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          borderBottom: "3px solid #e8e8e8",
        }}
      >
        {/* ── Red right panel with hawk ── */}
        <div
          style={{
            position: "absolute",
            right: 0, top: 0, bottom: 0,
            width: "52%",
            background: "linear-gradient(135deg, #cc0000 0%, #8b0000 100%)",
            clipPath: "polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)",
            zIndex: 0,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={hawkImg}
            alt="Rad Hawk mascot"
            className="hawk-float"
            style={{
              width: "82%",
              objectFit: "contain",
              opacity: 0.93,
              filter: "drop-shadow(-8px 12px 28px rgba(0,0,0,0.55))",
            }}
          />
        </div>

        {/* ── Diagonal accent slash ── */}
        <div
          style={{
            position: "absolute",
            left: "44%", top: 0, bottom: 0,
            width: "6px",
            background: "#cc0000",
            transform: "skewX(-8deg)",
            zIndex: 2,
          }}
        />

        {/* ── Left text content ── */}
        <div
          className={visible ? "hero-content-enter" : ""}
          style={{
            position: "relative",
            zIndex: 3,
            padding: "60px 48px",
            maxWidth: "560px",
            opacity: visible ? 1 : 0,
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: "13px",
              letterSpacing: "4px",
              color: "#cc0000",
              margin: "0 0 12px",
              textTransform: "uppercase",
            }}
          >
            LaGuardia Community College
          </p>

          {/* Main headline */}
          <h1
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: "clamp(52px, 8vw, 92px)",
              lineHeight: 0.9,
              color: "#111",
              margin: "0 0 8px",
              letterSpacing: "1px",
            }}
          >
            LA GUARDIA<br />
            <span style={{ color: "#cc0000" }}>RAD HAWK</span><br />
            MARKETPLACE
          </h1>

          {/* Sub-copy */}
          <p
            style={{
              color: "#555",
              fontSize: "15px",
              lineHeight: 1.7,
              margin: "18px 0 32px",
              maxWidth: "360px",
              fontFamily: "Georgia, serif",
            }}
          >
            Buy, sell, and connect with fellow LaGuardia students — all on campus.
          </p>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a href="/marketplace" className="hero-btn-primary">
              Browse Marketplace →
            </a>
            <a href="#categories" className="hero-btn-outline">
              Learn More
            </a>
          </div>

          {/* Quick stats */}
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">19+</span>
              <span className="hero-stat-label">Listings</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">9</span>
              <span className="hero-stat-label">Categories</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">100%</span>
              <span className="hero-stat-label">Campus-based</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
