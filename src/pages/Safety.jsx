// Safety.jsx  (pages/Safety.jsx)
// Redesigned safety cards:
//   - No emojis on cards; replaced with colored number badges
//   - Cleaner card borders and typography
//   - Slide-in animation on each card

import "./Safety.css";

const TIPS = [
  {
    title: "Meet in Safe Public Places",
    body:  "Always meet on campus or in a clearly public area with people around. Recommended spots include the Library atrium, the Student Union cafeteria, or any building lobby during operating hours. Avoid parking lots, isolated hallways, or private spaces.",
  },
  {
    title: "Verify the Item Before Paying",
    body:  "Inspect the item carefully in person before handing over any money. Make sure it matches the photos and description in the listing. If something looks different, you have every right to walk away.",
  },
  {
    title: "Use Trusted Payment Methods",
    body:  "Cash is safest for in-person transactions. If you use an app like Venmo or Zelle, only send payment after the item is in your hands. Never wire money or use gift cards for payment — these are common scam tactics.",
  },
  {
    title: "Protect Your Personal Information",
    body:  "Do not share your student ID number, home address, phone password, banking details, or social media login with any buyer or seller. Keep conversations within the marketplace platform whenever possible.",
  },
  {
    title: "Bring a Friend",
    body:  "For higher-value transactions, consider bringing a classmate or friend to the meetup. There is safety in numbers, and a second person can help verify the item as well.",
  },
  {
    title: "Report Suspicious Activity",
    body:  "If a seller pressures you, asks for unusual payment, or a listing seems too good to be true — report it immediately using the Support page. Your report helps protect the entire campus community.",
  },
];

export default function Safety() {
  return (
    <main className="safety-page" style={{ padding: "40px 48px" }}>

      {/* Hero banner */}
      <section className="safety-hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Marketplace Safety</h1>
          <p>
            Our college marketplace is designed to keep every transaction safe,
            transparent, and campus-friendly. Read these guidelines before your
            first buy or sell.
          </p>
        </div>
      </section>

      {/* Intro text */}
      <p style={{
        fontFamily: "Georgia, serif",
        color: "#555", fontSize: "15px", lineHeight: 1.8,
        maxWidth: "720px", margin: "0 0 32px",
      }}>
        Every exchange on Rad Hawk Marketplace happens between real LaGuardia
        students. While most transactions go smoothly, it's important to follow
        these six guidelines every time.
      </p>

      {/* Tip cards */}
      <div className="safety-cards-grid">
        {TIPS.map((tip, i) => (
          <div key={tip.title} className="safety-card-new" style={{ animationDelay: `${i * 0.08}s` }}>
            {/* Number badge */}
            <div className="safety-card-badge">{String(i + 1).padStart(2, "0")}</div>

            <div className="safety-card-body">
              <h3 className="safety-card-title">{tip.title}</h3>
              <p className="safety-card-text">{tip.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Warning block */}
      <section className="safety-warning">
        <div className="safety-warning-inner">
          <div className="safety-warn-label">Important</div>
          <h2>Trust Your Instincts</h2>
          <p>
            If something feels off — a seller who won't meet on campus, a price that
            seems unbelievably low, or pressure to pay before you see the item — pause
            the transaction and contact support. Your safety is more important than any deal.
          </p>
          <a href="/support" className="safety-warn-btn">Contact Support →</a>
        </div>
      </section>

    </main>
  );
}
