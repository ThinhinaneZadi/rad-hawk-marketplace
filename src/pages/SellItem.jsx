// SellItem.jsx  (src/pages/SellItem.jsx)
//
// FIX from previous version:
//   - Image is now stored as base64 in localStorage via FileReader (was already done,
//     but we added a clearer check to make sure imagePreview is passed to postListing)
//   - The listing ID is now guaranteed to be a plain string like "user_1718000000000"
//     so ItemDetails.jsx can find it with a string comparison (not Number())
//   - Added item.description field properly so it shows on the details page
// solved conflict

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  "Clothes", "Shoes", "Books", "Electronics",
  "Furniture", "School Supplies", "Accessories", "Sports", "Other",
];
const CONDITIONS = ["Like New", "Good", "Used"];

const STYLES = `
  @keyframes sellFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .sell-input {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #e0e0e0;
    border-radius: 7px;
    font-size: 14px;
    font-family: Georgia, serif;
    color: #111;
    background: #fff;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .sell-input:focus {
    border-color: #cc0000;
    box-shadow: 0 0 0 3px rgba(204,0,0,0.08);
  }
  .sell-input.err  { border-color: #e53935; }
  .sell-input::placeholder { color: #bbb; }

  .sell-submit {
    padding: 14px 36px;
    background: #cc0000;
    color: #fff;
    border: none;
    border-radius: 7px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
  }
  .sell-submit:hover {
    background: #a50000;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(204,0,0,0.3);
  }
  .sell-submit:disabled {
    background: #ccc; cursor: not-allowed;
    transform: none; box-shadow: none;
  }

  .cond-btn {
    flex: 1; padding: 10px 8px;
    border: 2px solid #e0e0e0; border-radius: 7px;
    background: #fff; color: #777;
    font-size: 12px; font-weight: 700;
    font-family: Georgia, serif; cursor: pointer;
    transition: all 0.18s; text-align: center;
  }
  .cond-btn.selected { border-color: #cc0000; background: #fff5f5; color: #cc0000; }
  .cond-btn:hover:not(.selected) { border-color: #bbb; color: #333; }

  .photo-zone {
    border: 2px dashed #e0e0e0; border-radius: 8px;
    padding: 28px 20px; text-align: center; cursor: pointer;
    transition: border-color 0.2s, background 0.2s; background: #fafafa;
  }
  .photo-zone:hover { border-color: #cc0000; background: #fff5f5; }
  .photo-zone.has-image {
    border-color: #cc0000; border-style: solid; padding: 0; overflow: hidden;
  }
  .photo-preview {
    width: 100%; max-height: 220px; object-fit: cover;
    display: block; border-radius: 6px;
  }

  .sell-section {
    background: #fff; border: 1.5px solid #ebebeb;
    border-radius: 10px; padding: 24px;
    margin-bottom: 20px; animation: sellFadeIn 0.5s ease both;
  }
  .sell-section-h {
    font-family: 'Bebas Neue', Impact, sans-serif;
    font-size: 16px; letter-spacing: 1.5px; color: #111;
    margin: 0 0 18px; display: flex; align-items: center; gap: 10px;
  }
  .sell-section-h::after { content: ''; flex: 1; height: 2px; background: #cc0000; }

  .sell-label {
    display: block; font-size: 11px; font-weight: 700;
    color: #888; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 6px;
  }
  .sell-label .req { color: #cc0000; margin-left: 2px; }
  .sell-label .opt {
    color: #ccc; font-weight: 400; text-transform: none;
    letter-spacing: 0; font-size: 10px; margin-left: 4px;
  }
  .sell-error { color: #e53935; font-size: 11px; font-family: Georgia, serif; margin-top: 4px; }

  .sell-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 560px) { .sell-row { grid-template-columns: 1fr; } }
`;

function Field({ label, required, error, children }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label className="sell-label">
        {label}
        {required  && <span className="req">*</span>}
        {!required && <span className="opt">(optional)</span>}
      </label>
      {children}
      {error && <p className="sell-error">{error}</p>}
    </div>
  );
}

export default function SellItem() {
  const { currentUser, postListing } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "", price: "", category: "", condition: "Good",
    description: "", location: "",
  });
  const [errors, setErrors]             = useState({});
  const [imagePreview, setImagePreview] = useState(null);  // base64 string or null
  const [submitting, setSubmitting]     = useState(false);
  const [posted, setPosted]             = useState(false);
  const [newListing, setNewListing]     = useState(null);

  // ── Not logged in ──────────────────────────────────────────────
  if (!currentUser) {
    return (
      <>
        <style>{STYLES}</style>
        <main style={{
          minHeight: "60vh", display: "flex",
          alignItems: "center", justifyContent: "center",
          padding: "48px 24px", textAlign: "center",
        }}>
          <div>
            <div style={{ fontSize: "52px", marginBottom: "16px" }}>🔒</div>
            <h2 style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: "28px", color: "#111", marginBottom: "12px",
            }}>
              Sign In to Post a Listing
            </h2>
            <p style={{
              color: "#777", fontFamily: "Georgia, serif",
              fontSize: "14px", lineHeight: 1.7, marginBottom: "24px",
            }}>
              You need a free account to advertise your items on Rad Hawk Marketplace.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/auth" style={{
                padding: "12px 28px", background: "#cc0000", color: "#fff",
                fontWeight: 700, fontSize: "13px", letterSpacing: "1px",
                textTransform: "uppercase", textDecoration: "none", borderRadius: "6px",
              }}>Login / Register →</Link>
              <Link to="/marketplace" style={{
                padding: "12px 24px", background: "transparent", color: "#111",
                border: "2px solid #111", fontWeight: 600, fontSize: "13px",
                textDecoration: "none", borderRadius: "6px",
              }}>Browse Marketplace</Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  // ── Handle photo upload ────────────────────────────────────────
  // FileReader converts the image file to a base64 string.
  // base64 strings can be stored in localStorage and used as <img src="…">.
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG, etc.)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Photo must be under 2MB.");
      return;
    }

    const reader = new FileReader();
    // When FileReader finishes reading, save the base64 result to state
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);   // converts file → "data:image/jpeg;base64,…"
  };

  // ── Validate ───────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.title.trim())           e.title    = "Item title is required.";
    else if (form.title.length < 3)   e.title    = "Title must be at least 3 characters.";
    if (!form.price)                  e.price    = "Price is required.";
    else if (Number(form.price) < 0)  e.price    = "Price cannot be negative.";
    else if (isNaN(Number(form.price))) e.price  = "Enter a valid number.";
    if (!form.category)               e.category = "Please choose a category.";
    return e;
  };

  // ── Submit ─────────────────────────────────────────────────────
  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      // Pass imagePreview (base64 string or null) so AuthContext saves it
      const result = postListing({
        ...form,
        imagePreview,   // ← this is the base64 string, saved as item.image in localStorage
      });

      if (!result.success) {
        alert(result.message);
        setSubmitting(false);
        return;
      }

      setNewListing(result.listing);
      setPosted(true);
      setSubmitting(false);
    }, 600);
  };

  // ── Success screen ─────────────────────────────────────────────
  if (posted && newListing) {
    return (
      <>
        <style>{STYLES}</style>
        <main style={{
          minHeight: "70vh", display: "flex",
          alignItems: "center", justifyContent: "center",
          padding: "48px 24px", background: "#f7f7f7",
        }}>
          <div style={{
            background: "#fff", border: "2px solid #ebebeb",
            borderTop: "4px solid #cc0000", borderRadius: "12px",
            padding: "40px 36px", maxWidth: "480px", width: "100%",
            textAlign: "center", animation: "sellFadeIn 0.5s ease both",
          }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "#e8f5e9", border: "2px solid #66bb6a",
              color: "#2e7d32", fontSize: "28px",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>✓</div>

            <h2 style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: "28px", letterSpacing: "1.5px",
              color: "#111", margin: "0 0 8px",
            }}>
              Listing Posted!
            </h2>
            <p style={{
              color: "#666", fontFamily: "Georgia, serif",
              fontSize: "14px", lineHeight: 1.7, margin: "0 0 6px",
            }}>
              <strong style={{ color: "#111" }}>{newListing.title}</strong> is now
              live on the Rad Hawk Marketplace.
            </p>
            <p style={{ color: "#aaa", fontFamily: "Georgia, serif", fontSize: "13px", margin: "0 0 28px" }}>
              Listed for <strong style={{ color: "#cc0000" }}>${newListing.price}</strong> ·{" "}
              {newListing.category} · {newListing.condition}
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              {/* This link uses the listing's string ID — ItemDetails will find it in localStorage */}
              <Link
                to={`/item/${newListing.id}`}
                style={{
                  padding: "12px 24px", background: "#cc0000", color: "#fff",
                  fontWeight: 700, fontSize: "13px", letterSpacing: "1px",
                  textTransform: "uppercase", textDecoration: "none",
                  borderRadius: "6px", transition: "background 0.18s",
                }}
                onMouseEnter={e => e.currentTarget.style.background="#a50000"}
                onMouseLeave={e => e.currentTarget.style.background="#cc0000"}
              >
                View My Listing →
              </Link>

              <button
                onClick={() => {
                  setForm({ title:"", price:"", category:"", condition:"Good", description:"", location:"" });
                  setImagePreview(null);
                  setErrors({});
                  setPosted(false);
                  setNewListing(null);
                }}
                style={{
                  padding: "12px 20px", background: "transparent",
                  border: "2px solid #111", color: "#111",
                  fontWeight: 600, fontSize: "13px",
                  textTransform: "uppercase", borderRadius: "6px",
                  cursor: "pointer", transition: "background 0.18s, color 0.18s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background="#111"; e.currentTarget.style.color="#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#111"; }}
              >
                Post Another
              </button>

              <Link to="/dashboard" style={{
                padding: "12px 20px", background: "transparent",
                border: "2px solid #ccc", color: "#888",
                fontWeight: 600, fontSize: "13px",
                textDecoration: "none", borderRadius: "6px",
              }}>
                Dashboard
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  // ── Main form ──────────────────────────────────────────────────
  return (
    <>
      <style>{STYLES}</style>

      <main style={{ background: "#f7f7f7", minHeight: "100vh", padding: "40px 24px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom: "28px" }}>
            <p style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: "12px", letterSpacing: "4px",
              color: "#cc0000", textTransform: "uppercase", margin: "0 0 6px",
            }}>
              Rad Hawk Marketplace
            </p>
            <h1 style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: "clamp(28px, 5vw, 42px)",
              color: "#111", letterSpacing: "1.5px", margin: "0 0 8px",
            }}>
              Post a Listing
            </h1>
            <p style={{ color: "#888", fontFamily: "Georgia, serif", fontSize: "14px", margin: 0 }}>
              Posting as <strong style={{ color: "#111" }}>{currentUser.fullName}</strong>
              {" · "}
              <Link to="/dashboard" style={{ color: "#cc0000", textDecoration: "none" }}>
                My Dashboard
              </Link>
            </p>
          </div>

          {/* ── Section 1: Item basics ── */}
          <div className="sell-section" style={{ animationDelay: "0s" }}>
            <h2 className="sell-section-h">Item Details</h2>

            <Field label="Item Title" required error={errors.title}>
              <input
                className={`sell-input ${errors.title ? "err" : ""}`}
                type="text"
                placeholder='e.g. "Nike Hoodie — Size M"'
                value={form.title}
                maxLength={80}
                onChange={e => {
                  setForm(f => ({ ...f, title: e.target.value }));
                  setErrors(er => ({ ...er, title: "" }));
                }}
              />
              <p style={{ color: "#ccc", fontSize: "10px", margin: "4px 0 0", fontFamily: "Georgia, serif" }}>
                {form.title.length}/80 characters
              </p>
            </Field>

            <div className="sell-row">
              <Field label="Price ($)" required error={errors.price}>
                <div style={{ position: "relative" }}>
                  <span style={{
                    position: "absolute", left: "13px", top: "50%",
                    transform: "translateY(-50%)",
                    color: "#aaa", fontSize: "14px", fontWeight: 700,
                  }}>$</span>
                  <input
                    className={`sell-input ${errors.price ? "err" : ""}`}
                    type="number" placeholder="0" min="0"
                    style={{ paddingLeft: "28px" }}
                    value={form.price}
                    onChange={e => {
                      setForm(f => ({ ...f, price: e.target.value }));
                      setErrors(er => ({ ...er, price: "" }));
                    }}
                  />
                </div>
                <p style={{ color: "#ccc", fontSize: "10px", margin: "4px 0 0", fontFamily: "Georgia, serif" }}>
                  Enter 0 for free items
                </p>
              </Field>

              <Field label="Category" required error={errors.category}>
                <select
                  className={`sell-input ${errors.category ? "err" : ""}`}
                  value={form.category}
                  onChange={e => {
                    setForm(f => ({ ...f, category: e.target.value }));
                    setErrors(er => ({ ...er, category: "" }));
                  }}
                >
                  <option value="">Select a category…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Condition" required>
              <div style={{ display: "flex", gap: "10px" }}>
                {CONDITIONS.map(c => (
                  <button
                    key={c}
                    className={`cond-btn ${form.condition === c ? "selected" : ""}`}
                    onClick={() => setForm(f => ({ ...f, condition: c }))}
                  >
                    {c === "Like New" ? "✨ Like New" : c === "Good" ? "👍 Good" : "📦 Used"}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          {/* ── Section 2: Description & location ── */}
          <div className="sell-section" style={{ animationDelay: "0.08s" }}>
            <h2 className="sell-section-h">More Info</h2>

            <Field label="Description">
              <textarea
                className="sell-input"
                rows={4}
                placeholder="Describe your item — size, color, why you're selling, any flaws…"
                style={{ resize: "vertical" }}
                value={form.description}
                maxLength={500}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
              <p style={{ color: "#ccc", fontSize: "10px", margin: "4px 0 0", fontFamily: "Georgia, serif" }}>
                {form.description.length}/500 — More detail = more interest from buyers
              </p>
            </Field>

            <Field label="Meet-up Location">
              <input
                className="sell-input"
                type="text"
                placeholder='e.g. "Library entrance", "Building E lobby"'
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              />
              <p style={{ color: "#ccc", fontSize: "10px", margin: "4px 0 0", fontFamily: "Georgia, serif" }}>
                Tip: Choose a busy campus spot for safety
              </p>
            </Field>
          </div>

          {/* ── Section 3: Photo ── */}
          <div className="sell-section" style={{ animationDelay: "0.16s" }}>
            <h2 className="sell-section-h">Photo</h2>

            {imagePreview ? (
              <div className="photo-zone has-image">
                <img src={imagePreview} alt="Preview" className="photo-preview" />
                <button
                  onClick={() => setImagePreview(null)}
                  style={{
                    display: "block", width: "100%", padding: "10px",
                    background: "#fff5f5", border: "none",
                    borderTop: "1px solid #ffd0d0",
                    color: "#cc0000", fontSize: "12px", fontWeight: 700,
                    cursor: "pointer", transition: "background 0.18s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background="#ffe0e0"}
                  onMouseLeave={e => e.currentTarget.style.background="#fff5f5"}
                >
                  ✕ Remove Photo
                </button>
              </div>
            ) : (
              <label className="photo-zone" style={{ display: "block" }}>
                <input type="file" accept="image/*"
                  style={{ display: "none" }} onChange={handlePhoto} />
                <div style={{ fontSize: "32px", marginBottom: "10px" }}>📷</div>
                <p style={{ color: "#aaa", fontFamily: "Georgia, serif", fontSize: "13px", margin: "0 0 4px" }}>
                  Click to upload a photo
                </p>
                <p style={{ color: "#ccc", fontSize: "11px", margin: 0, fontFamily: "Georgia, serif" }}>
                  JPG, PNG — max 2MB · Optional but strongly recommended
                </p>
              </label>
            )}
          </div>

          {/* ── Live preview ── */}
          {(form.title || form.price) && (
            <div className="sell-section" style={{ animationDelay: "0.24s" }}>
              <h2 className="sell-section-h">Preview</h2>
              <p style={{ color: "#aaa", fontSize: "11px", fontFamily: "Georgia, serif", margin: "0 0 14px" }}>
                Rough preview of how your card will look in the marketplace.
              </p>
              <div style={{
                border: "2px solid #ebebeb", borderRadius: "8px",
                overflow: "hidden", maxWidth: "220px",
              }}>
                <div style={{
                  height: "120px", background: imagePreview ? "transparent" : "#f5f5f5",
                  display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                }}>
                  {imagePreview
                    ? <img src={imagePreview} alt="preview" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    : <span style={{ fontSize: "36px" }}>📦</span>}
                </div>
                <div style={{ padding: "10px 12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#111" }}>
                      {form.title || "Your item title"}
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: 800, color: "#cc0000" }}>
                      {form.price ? `$${form.price}` : "$0"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {form.category && (
                      <span style={{
                        background: "#f0f0f0", color: "#555", fontSize: "8px",
                        fontWeight: 700, padding: "2px 6px", borderRadius: "3px", textTransform: "uppercase",
                      }}>{form.category}</span>
                    )}
                    <span style={{
                      background: form.condition === "Like New" ? "#e8f5e9"
                                : form.condition === "Good"     ? "#fff8e1" : "#fce4ec",
                      color:      form.condition === "Like New" ? "#2e7d32"
                                : form.condition === "Good"     ? "#f57f17" : "#c62828",
                      fontSize: "8px", fontWeight: 700,
                      padding: "2px 6px", borderRadius: "3px", textTransform: "uppercase",
                    }}>{form.condition}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Submit ── */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", marginTop: "4px" }}>
            <button className="sell-submit" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Posting…" : "Post Listing →"}
            </button>
            <Link to="/marketplace" style={{
              color: "#aaa", fontSize: "13px", fontFamily: "Georgia, serif", textDecoration: "none",
            }}>
              Cancel
            </Link>
          </div>

          <p style={{
            color: "#bbb", fontSize: "11px", fontFamily: "Georgia, serif",
            lineHeight: 1.6, marginTop: "20px",
          }}>
            🛡️ By posting, you agree to meet buyers in safe campus locations.
            Review our <Link to="/safety" style={{ color: "#cc0000" }}>Safety Tips</Link>.
          </p>

        </div>
      </main>
    </>
  );
}
