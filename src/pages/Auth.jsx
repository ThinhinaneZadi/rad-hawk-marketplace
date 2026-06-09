// Auth.jsx  (src/pages/Auth.jsx)
// Full login + register page connected to AuthContext / localStorage.
//
// Register fields:
//   Required : Full name, Email, Password, Confirm Password, Role
//   Optional : College email, Phone, Bio
//
// Login fields:
//   Required : Email, Password
//
// After register/login → redirects to /dashboard

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import hawkImg from "../assets/images/radhawk.png";

// ── Inline styles / keyframes ──────────────────────────────────
const STYLES = `
  @keyframes authFadeIn {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes floatHawk {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-12px); }
  }

  /* Input base */
  .auth-input {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #2a2a2a;
    border-radius: 6px;
    background: #1a1a1a;
    color: #eee;
    font-size: 13px;
    font-family: Georgia, serif;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .auth-input:focus  { border-color: #cc0000; background: #1f1f1f; }
  .auth-input.err    { border-color: #ff6b6b; }
  .auth-input::placeholder { color: #4a4a4a; }

  /* Submit button */
  .auth-submit {
    width: 100%;
    padding: 12px;
    background: #cc0000;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    cursor: pointer;
    margin-top: 6px;
    transition: background 0.18s, transform 0.15s;
  }
  .auth-submit:hover { background: #a50000; transform: translateY(-2px); }

  /* Role toggle */
  .role-btn {
    flex: 1;
    padding: 10px;
    border: 2px solid #2a2a2a;
    border-radius: 6px;
    background: #1a1a1a;
    color: #666;
    font-size: 13px;
    font-weight: 700;
    font-family: Georgia, serif;
    cursor: pointer;
    transition: all 0.18s;
  }
  .role-btn.selected {
    border-color: #cc0000;
    background: rgba(204,0,0,0.14);
    color: #fff;
  }
  .role-btn:hover:not(.selected) { border-color: #444; color: #bbb; }

  /* View tabs */
  .auth-tab {
    flex: 1; padding: 10px;
    background: transparent; border: none;
    color: #555; font-size: 14px; font-weight: 700;
    font-family: Georgia, serif;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: color 0.18s, border-color 0.18s;
    letter-spacing: 0.3px;
  }
  .auth-tab.on { color: #fff; border-bottom-color: #cc0000; }

  /* Section divider inside form */
  .form-divider {
    display: flex; align-items: center; gap: 10px;
    margin: 4px 0;
  }
  .form-divider span {
    color: #333; font-size: 10px; letter-spacing: 1px;
    text-transform: uppercase; white-space: nowrap;
    font-family: Georgia, serif;
  }
  .form-divider::before, .form-divider::after {
    content: ''; flex: 1; height: 1px; background: #222;
  }
`;

// ── Reusable field wrapper ─────────────────────────────────────
function Field({ label, required, error, hint, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label style={{
        color: "#777", fontSize: "10px", fontWeight: 700,
        letterSpacing: "0.8px", textTransform: "uppercase",
      }}>
        {label}
        {required && <span style={{ color: "#cc0000", marginLeft: "3px" }}>*</span>}
        {!required && <span style={{ color: "#444", marginLeft: "4px", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>}
      </label>
      {children}
      {hint  && !error && <span style={{ color: "#444", fontSize: "10px", fontFamily: "Georgia, serif" }}>{hint}</span>}
      {error && <span style={{ color: "#ff6b6b", fontSize: "11px", fontFamily: "Georgia, serif" }}>{error}</span>}
    </div>
  );
}

function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

// ═══════════════════════════════════════════════
//  REGISTER FORM
// ═══════════════════════════════════════════════
function RegisterForm({ onSuccess }) {
  const { register } = useAuth();

  const [form, setForm] = useState({
    fullName: "", email: "", password: "", confirm: "",
    role: "Buyer", collegeEmail: "", phone: "", bio: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(er => ({ ...er, [field]: "" }));
    setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())           e.fullName = "Full name is required.";
    if (!form.email.trim())              e.email    = "Email is required.";
    else if (!isEmail(form.email))       e.email    = "Enter a valid email address.";
    if (!form.password)                  e.password = "Password is required.";
    else if (form.password.length < 6)   e.password = "Password must be at least 6 characters.";
    if (form.confirm !== form.password)  e.confirm  = "Passwords do not match.";
    if (form.collegeEmail && !isEmail(form.collegeEmail))
                                         e.collegeEmail = "Enter a valid college email.";
    return e;
  };

  const submit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const result = register(form);
    if (!result.success) { setApiError(result.message); return; }
    onSuccess();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>

      {/* Role selector — shown first so users think about it upfront */}
      <Field label="I mainly want to" required>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className={`role-btn ${form.role === "Buyer" ? "selected" : ""}`}
            onClick={() => setForm(f => ({ ...f, role: "Buyer" }))}>
            🛒 Buy Items
          </button>
          <button className={`role-btn ${form.role === "Seller" ? "selected" : ""}`}
            onClick={() => setForm(f => ({ ...f, role: "Seller" }))}>
            🏷️ Sell Items
          </button>
        </div>
        <p style={{ color: "#444", fontSize: "10px", fontFamily: "Georgia, serif", margin: "2px 0 0" }}>
          {form.role === "Buyer"
            ? "You'll be set up as a Buyer — but you can still post listings anytime."
            : "You'll be set up as a Seller — but you can still browse and buy anytime."}
        </p>
      </Field>

      {/* Required fields */}
      <Field label="Full Name" required error={errors.fullName}>
        <input className={`auth-input ${errors.fullName ? "err" : ""}`}
          type="text" placeholder="Your full name"
          value={form.fullName} onChange={set("fullName")} />
      </Field>

      <Field label="Email Address" required error={errors.email}>
        <input className={`auth-input ${errors.email ? "err" : ""}`}
          type="email" placeholder="you@example.com"
          value={form.email} onChange={set("email")} />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <Field label="Password" required error={errors.password}
          hint="At least 6 characters">
          <input className={`auth-input ${errors.password ? "err" : ""}`}
            type="password" placeholder="••••••"
            value={form.password} onChange={set("password")} />
        </Field>
        <Field label="Confirm Password" required error={errors.confirm}>
          <input className={`auth-input ${errors.confirm ? "err" : ""}`}
            type="password" placeholder="••••••"
            value={form.confirm} onChange={set("confirm")} />
        </Field>
      </div>

      {/* Optional fields */}
      <div className="form-divider"><span>Optional — add later if you want</span></div>

      <Field label="College / Student Email" error={errors.collegeEmail}
        hint="e.g. yourname@lagcc.cuny.edu">
        <input className={`auth-input ${errors.collegeEmail ? "err" : ""}`}
          type="email" placeholder="yourname@lagcc.cuny.edu"
          value={form.collegeEmail} onChange={set("collegeEmail")} />
      </Field>

      <Field label="Phone Number"
        hint="Only visible to you">
        <input className="auth-input"
          type="tel" placeholder="+1 (718) 000-0000"
          value={form.phone} onChange={set("phone")} />
      </Field>

      <Field label="Bio — Tell us about yourself"
        hint="Appears on your public profile">
        <textarea className="auth-input"
          rows={3} placeholder="e.g. CS student at LaGuardia, selling textbooks and electronics…"
          style={{ resize: "vertical" }}
          value={form.bio} onChange={set("bio")} />
      </Field>

      {/* API-level error (e.g. email already taken) */}
      {apiError && (
        <div style={{
          background: "rgba(255,107,107,0.1)", border: "1px solid #ff6b6b",
          borderRadius: "6px", padding: "10px 14px",
          color: "#ff6b6b", fontSize: "12px", fontFamily: "Georgia, serif",
        }}>
          {apiError}
        </div>
      )}

      <button className="auth-submit" onClick={submit}>Create Account →</button>

      {/* Security note */}
      <p style={{
        color: "#333", fontSize: "10px", fontFamily: "Georgia, serif",
        lineHeight: 1.6, textAlign: "center", borderTop: "1px solid #1e1e1e", paddingTop: "10px",
      }}>
        🔒 <strong style={{ color: "#555" }}>Class project note:</strong> Account data is stored
        in your browser's localStorage for demo purposes. In a real app, passwords would be
        securely hashed on a backend server and never stored in plain text.
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  LOGIN FORM
// ═══════════════════════════════════════════════
function LoginForm({ onSuccess }) {
  const { login } = useAuth();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(er => ({ ...er, [field]: "" }));
    setApiError("");
  };

  const submit = () => {
    const e = {};
    if (!form.email.trim())        e.email    = "Email is required.";
    else if (!isEmail(form.email)) e.email    = "Enter a valid email.";
    if (!form.password)            e.password = "Password is required.";
    if (Object.keys(e).length) { setErrors(e); return; }

    const result = login(form.email, form.password);
    if (!result.success) { setApiError(result.message); return; }
    onSuccess();
  };

  // Allow pressing Enter to submit
  const onKey = (e) => { if (e.key === "Enter") submit(); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <Field label="Email Address" required error={errors.email}>
        <input className={`auth-input ${errors.email ? "err" : ""}`}
          type="email" placeholder="you@example.com"
          value={form.email} onChange={set("email")} onKeyDown={onKey} />
      </Field>

      <Field label="Password" required error={errors.password}>
        <input className={`auth-input ${errors.password ? "err" : ""}`}
          type="password" placeholder="Your password"
          value={form.password} onChange={set("password")} onKeyDown={onKey} />
      </Field>

      {apiError && (
        <div style={{
          background: "rgba(255,107,107,0.1)", border: "1px solid #ff6b6b",
          borderRadius: "6px", padding: "10px 14px",
          color: "#ff6b6b", fontSize: "12px", fontFamily: "Georgia, serif",
        }}>
          {apiError}
        </div>
      )}

      <button className="auth-submit" onClick={submit}>Log In →</button>

      <p style={{ textAlign: "center", color: "#444", fontSize: "12px", fontFamily: "Georgia, serif" }}>
        Don't have an account?{" "}
        <span style={{ color: "#cc0000", fontWeight: 700 }}>Switch to Register above.</span>
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  MAIN AUTH PAGE
// ═══════════════════════════════════════════════
export default function Auth() {
  const [view, setView] = useState("register");   // "register" | "login"
  const navigate        = useNavigate();
  const { currentUser } = useAuth();

  // If already logged in, go straight to dashboard
  if (currentUser) {
    navigate("/dashboard");
    return null;
  }

  const handleSuccess = () => navigate("/dashboard");

  return (
    <>
      <style>{STYLES}</style>

      <main style={{
        background: "#0d0d0d", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 20px",
      }}>
        <div style={{
          display: "flex", maxWidth: "900px", width: "100%",
          borderRadius: "14px", overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.75)",
          animation: "authFadeIn 0.65s cubic-bezier(.22,1,.36,1) both",
        }}>

          {/* ── Left branding panel ── */}
          <div style={{
            flex: "0 0 300px",
            background: "linear-gradient(160deg, #cc0000 0%, #6b0000 100%)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "48px 28px", textAlign: "center",
          }}>
            <img src={hawkImg} alt="Rad Hawk"
              style={{
                width: "130px", objectFit: "contain", marginBottom: "20px",
                filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.5))",
                animation: "floatHawk 3.5s ease-in-out infinite",
              }} />
            <h1 style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: "30px", letterSpacing: "2px", color: "#fff", margin: "0 0 4px",
            }}>RAD HAWK</h1>
            <p style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: "11px", letterSpacing: "4px",
              color: "rgba(255,255,255,0.55)", margin: "0 0 18px",
            }}>MARKETPLACE</p>
            <p style={{
              color: "rgba(255,255,255,0.7)", fontSize: "12px",
              lineHeight: 1.7, fontFamily: "Georgia, serif",
            }}>
              LaGuardia Community College's student marketplace. Buy, sell, and connect with your campus.
            </p>
            <div style={{ marginTop: "24px", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "18px", width: "100%" }}>
              <Link to="/marketplace" style={{
                color: "rgba(255,255,255,0.6)", fontSize: "11px",
                textDecoration: "none", letterSpacing: "0.3px",
              }}>← Browse without signing in</Link>
            </div>
          </div>

          {/* ── Right form panel ── */}
          <div style={{
            flex: 1, background: "#161616",
            padding: "36px 32px", overflowY: "auto", maxHeight: "90vh",
          }}>
            {/* Tab toggle */}
            <div style={{ display: "flex", borderBottom: "1px solid #222", marginBottom: "24px" }}>
              <button className={`auth-tab ${view === "register" ? "on" : ""}`}
                onClick={() => setView("register")}>Register</button>
              <button className={`auth-tab ${view === "login" ? "on" : ""}`}
                onClick={() => setView("login")}>Log In</button>
            </div>

            {/* Heading */}
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: "22px", letterSpacing: "1.5px", color: "#fff", margin: "0 0 4px",
              }}>
                {view === "register" ? "Create Your Account" : "Welcome Back"}
              </h2>
              <p style={{ color: "#555", fontSize: "12px", fontFamily: "Georgia, serif" }}>
                {view === "register"
                  ? "Join the LaGuardia student marketplace in under a minute."
                  : "Log in to access your dashboard and listings."}
              </p>
            </div>

            {view === "register"
              ? <RegisterForm onSuccess={handleSuccess} />
              : <LoginForm    onSuccess={handleSuccess} />}
          </div>
        </div>
      </main>
    </>
  );
}
