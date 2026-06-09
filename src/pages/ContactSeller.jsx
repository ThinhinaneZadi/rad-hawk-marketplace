// ContactSeller.jsx  (pages/ContactSeller.jsx)
// Message seller + meeting request cards.
// Redesigned to match the red/black/white brand instead of plain red.

import { useState } from "react";

const STYLE = `
  @keyframes csSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .cs-card {
    animation: csSlideUp 0.55s cubic-bezier(.22,1,.36,1) both;
  }
  .cs-card:nth-child(2) {
    animation-delay: 0.12s;
  }
  .cs-input {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #2a2a2a;
    border-radius: 6px;
    background: #1a1a1a;
    color: #eee;
    font-size: 14px;
    font-family: Georgia, serif;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.2s;
  }
  .cs-input:focus {
    border-color: #cc0000;
  }
  .cs-input::placeholder {
    color: #555;
  }
  .cs-btn {
    width: 100%;
    padding: 13px;
    background: #cc0000;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.18s, transform 0.15s;
  }
  .cs-btn:hover {
    background: #a50000;
    transform: translateY(-2px);
  }
`;

export default function ContactSeller() {
  const [sent, setSent] = useState(false);
  const [meetSent, setMeetSent] = useState(false);
  const [message, setMessage] = useState("Hi, is this still available?");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  return (
    <>
      <style>{STYLE}</style>

      {/* Dark page background to match the navbar/footer */}
      <main
        style={{
          background: "#0d0d0d",
          minHeight: "100vh",
          padding: "48px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
        }}
      >
        {/* Page title */}
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <p
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: "13px", letterSpacing: "4px",
              color: "#cc0000", textTransform: "uppercase", margin: "0 0 6px",
            }}
          >
            Rad Hawk Marketplace
          </p>
          <h1
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: "clamp(28px, 5vw, 42px)",
              color: "#fff", letterSpacing: "2px", margin: 0,
            }}
          >
            CONTACT SELLER
          </h1>
        </div>

        {/* ── Message card ── */}
        <div
          className="cs-card"
          style={{
            background: "#161616",
            border: "2px solid #2a2a2a",
            borderTop: "4px solid #cc0000",
            borderRadius: "12px",
            padding: "28px",
            width: "100%",
            maxWidth: "380px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: "22px", letterSpacing: "2px",
              color: "#fff", margin: "0 0 20px", textAlign: "center",
            }}
          >
            Message Seller
          </h2>

          {/* Seller avatar */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div
              style={{
                width: "60px", height: "60px", borderRadius: "50%",
                background: "linear-gradient(135deg, #cc0000, #8b0000)",
                color: "#fff", margin: "0 auto",
                display: "flex", justifyContent: "center", alignItems: "center",
                fontSize: "24px", fontWeight: 800,
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                boxShadow: "0 4px 16px rgba(204,0,0,0.35)",
              }}
            >
              S
            </div>
            <h3 style={{ color: "#fff", margin: "10px 0 2px", fontSize: "15px", fontWeight: 700 }}>
              Cristina
            </h3>
            <p style={{ color: "#666", fontSize: "12px", margin: 0 }}>
              🟢 Active today
            </p>
          </div>

          {/* Message textarea */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block", color: "#888", fontSize: "11px",
                fontWeight: 700, letterSpacing: "1px",
                textTransform: "uppercase", marginBottom: "8px",
              }}
            >
              Your Message
            </label>
            <textarea
              className="cs-input"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ resize: "none" }}
            />
          </div>

          {sent ? (
            <div
              style={{
                textAlign: "center", padding: "12px",
                background: "rgba(46,125,50,0.18)", border: "1px solid #2e7d32",
                borderRadius: "6px", color: "#66bb6a", fontSize: "13px", fontWeight: 700,
              }}
            >
              ✓ Message sent!
            </div>
          ) : (
            <button className="cs-btn" onClick={() => setSent(true)}>
              Send Message →
            </button>
          )}
        </div>

        {/* ── Meeting request card ── */}
        <div
          className="cs-card"
          style={{
            background: "#161616",
            border: "2px solid #2a2a2a",
            borderTop: "4px solid #cc0000",
            borderRadius: "12px",
            padding: "28px",
            width: "100%",
            maxWidth: "380px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: "22px", letterSpacing: "2px",
              color: "#fff", margin: "0 0 20px", textAlign: "center",
            }}
          >
            Request Meeting
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
            <div>
              <label
                style={{
                  display: "block", color: "#888", fontSize: "11px",
                  fontWeight: 700, letterSpacing: "1px",
                  textTransform: "uppercase", marginBottom: "8px",
                }}
              >
                Meeting Location
              </label>
              <input
                className="cs-input"
                type="text"
                placeholder="e.g. Building E, Library…"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block", color: "#888", fontSize: "11px",
                  fontWeight: 700, letterSpacing: "1px",
                  textTransform: "uppercase", marginBottom: "8px",
                }}
              >
                Proposed Date
              </label>
              <input
                className="cs-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {meetSent ? (
            <div
              style={{
                textAlign: "center", padding: "12px",
                background: "rgba(46,125,50,0.18)", border: "1px solid #2e7d32",
                borderRadius: "6px", color: "#66bb6a", fontSize: "13px", fontWeight: 700,
              }}
            >
              ✓ Meeting request sent!
            </div>
          ) : (
            <button className="cs-btn" onClick={() => setMeetSent(true)}>
              Request Meeting →
            </button>
          )}
        </div>

        {/* Safety tip */}
        <p
          style={{
            color: "#444", fontSize: "12px", textAlign: "center",
            maxWidth: "340px", lineHeight: 1.6,
          }}
        >
          🔒 Always meet on campus or in a public area. Review our{" "}
          <a href="/safety" style={{ color: "#cc0000", textDecoration: "none" }}>
            Safety Tips
          </a>{" "}
          before meeting a seller.
        </p>
      </main>
    </>
  );
}
