// Footer.jsx
// Site-wide footer — dark background, four columns, social icons.
// Minor updates: hover transitions use CSS class approach for cleanliness.

const STYLE = `
  .footer-link {
    color: #888;
    font-size: 13px;
    text-decoration: none;
    transition: color 0.2s;
    display: block;
    margin-bottom: 10px;
  }
  .footer-link:hover {
    color: #cc0000;
  }
  .footer-social {
    width: 36px;
    height: 36px;
    background: #1f1f1f;
    border: 1px solid #2a2a2a;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 800;
    text-decoration: none;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }
  .footer-social:hover {
    transform: translateY(-3px);
  }
  .col-heading {
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin: 0 0 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #cc0000;
    display: inline-block;
  }
`;

const QUICK_LINKS = [
  { label: "Home",        href: "/" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Safety",      href: "/safety" },
  { label: "Support",     href: "/support" },
];

const CATEGORIES = ["Clothes", "Shoes", "Books", "Electronics", "Furniture", "Free Items"];
const SAFETY_LINKS = ["Safety Tips", "Report a User", "Campus Meetup Spots", "Contact Support"];

const SOCIALS = [
  { icon: "f",  label: "Facebook",  color: "#1877f2" },
  { icon: "in", label: "LinkedIn",  color: "#0a66c2" },
  { icon: "ig", label: "Instagram", color: "#e1306c" },
];

export default function Footer() {
  return (
    <>
      <style>{STYLE}</style>

      <footer
        style={{
          background: "#111",
          color: "#fff",
          padding: "56px 48px 24px",
          borderTop: "4px solid #cc0000",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* ── Top grid: 4 columns ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "40px",
              marginBottom: "48px",
            }}
          >
            {/* Brand */}
            <div>
              <h2
                style={{
                  fontFamily: "'Bebas Neue', Impact, sans-serif",
                  fontSize: "28px",
                  letterSpacing: "2px",
                  margin: "0 0 4px",
                  color: "#fff",
                }}
              >
                RAD <span style={{ color: "#cc0000" }}>HAWK</span>
              </h2>
              <p
                style={{
                  fontSize: "11px",
                  letterSpacing: "3px",
                  color: "#555",
                  textTransform: "uppercase",
                  margin: "0 0 16px",
                }}
              >
                Marketplace
              </p>
              <p
                style={{
                  color: "#777",
                  fontSize: "13px",
                  lineHeight: 1.7,
                  maxWidth: "240px",
                }}
              >
                Buy, sell, and connect with LaGuardia students. Your campus. Your community.
              </p>
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    title={s.label}
                    className="footer-social"
                    style={{ color: s.color }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="col-heading">Quick Links</h4>
              {QUICK_LINKS.map((l) => (
                <a key={l.label} href={l.href} className="footer-link">
                  → {l.label}
                </a>
              ))}
            </div>

            {/* Categories */}
            <div>
              <h4 className="col-heading">Categories</h4>
              {CATEGORIES.map((cat) => (
                <a key={cat} href={`/marketplace?category=${cat}`} className="footer-link">
                  → {cat}
                </a>
              ))}
            </div>

            {/* Safety */}
            <div>
              <h4 className="col-heading">Safety</h4>
              {SAFETY_LINKS.map((item) => (
                <a key={item} href="/safety" className="footer-link">
                  → {item}
                </a>
              ))}
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div
            style={{
              borderTop: "1px solid #222",
              paddingTop: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <p style={{ color: "#444", fontSize: "12px", margin: 0 }}>
              © 2026 Rad Hawk Marketplace — LaGuardia Community College Student Project
            </p>
            <p style={{ color: "#444", fontSize: "12px", margin: 0 }}>
              Built with ❤️ by <span style={{ color: "#cc0000" }}>Team RAD HAWK</span>
            </p>
          </div>

        </div>
      </footer>
    </>
  );
}
