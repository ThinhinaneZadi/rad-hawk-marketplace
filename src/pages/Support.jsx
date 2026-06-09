// Support.jsx  (pages/Support.jsx)
// Fully functional contact form with:
//   - Field validation (name, email, message all required)
//   - Email format check
//   - Success message on submit
//   - Smooth focus effects on inputs

import "./Support.css";
import { useState } from "react";
import supportHawk from "../../assets/images/support_page_hawk.png";

const FAQS = [
  {
    q: "How do I create a listing?",
    a: "Go to the Marketplace page and click 'Post an Item'. Fill in the title, price, category, condition, and a photo. Your listing goes live instantly.",
  },
  {
    q: "How do I edit or remove a listing?",
    a: "Visit your account dashboard and find the listing you want to change. Click 'Edit' to update details or 'Delete' to remove it permanently.",
  },
  {
    q: "How do I report a user?",
    a: "Use the form on this page and select 'Report a User' as your subject. Include the username and a brief description — we review every report.",
  },
  {
    q: "How can I stay safe when meeting buyers or sellers?",
    a: "Always meet on campus in a busy public area. Check our full Safety page for detailed tips and recommended campus meetup spots.",
  },
];

// Very simple email check — enough for a front-end project
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Support() {
  // Form state
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  // Which fields have a validation error
  const [errors, setErrors] = useState({});
  // Did the user submit successfully?
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(f => ({ ...f, [id]: value }));
    // Clear error as the user types
    if (errors[id]) setErrors(er => ({ ...er, [id]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim())           newErrors.name    = "Full name is required.";
    if (!form.email.trim())          newErrors.email   = "Email address is required.";
    else if (!isValidEmail(form.email)) newErrors.email = "Please enter a valid email.";
    if (!form.message.trim())        newErrors.message = "Message cannot be empty.";
    return newErrors;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    // No backend — just show success message
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setErrors({});
  };

  return (
    <main className="support-page">

      {/* Header */}
      <section className="support-header">
        <h1>Support Center</h1>
        <p>
          Have a question, issue, or concern about the marketplace?
          Browse the FAQs or send us a message — we'll get back to you.
        </p>
      </section>

      <div className="support-grid">

        {/* ── FAQ card ── */}
        <section className="support-card faq-card">
          <h2>Frequently Asked Questions</h2>
          {FAQS.map((faq, i) => (
            <div key={i} className="faq-item">
              <h3>{faq.q}</h3>
              <p>{faq.a}</p>
            </div>
          ))}
        </section>

        {/* ── Contact form card ── */}
        <section className="support-card contact-card">
          <img src={supportHawk} alt="" className="contact-card-bg-image" />
          <div className="contact-card-overlay" />

          <div className="contact-card-content">
            <h2>Contact Support</h2>

            {/* ── Success state ── */}
            {submitted ? (
              <div className="form-success">
                <div className="form-success-icon">✓</div>
                <p className="form-success-title">Message Received!</p>
                <p className="form-success-body">
                  Thank you for reaching out. We'll get back to you within 1–2 business days.
                </p>
                <button
                  className="submit-btn"
                  style={{ marginTop: "16px" }}
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              /* ── Form ── */
              <div className="support-form">

                {/* Name */}
                <div className="form-group">
                  <label htmlFor="name">Full Name <span className="req">*</span></label>
                  <input
                    id="name" type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    className={errors.name ? "input-error" : ""}
                  />
                  {errors.name && <span className="error-msg">{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email">Email Address <span className="req">*</span></label>
                  <input
                    id="email" type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    className={errors.email ? "input-error" : ""}
                  />
                  {errors.email && <span className="error-msg">{errors.email}</span>}
                </div>

                {/* Subject (optional) */}
                <div className="form-group">
                  <label htmlFor="subject">Subject <span className="opt">(optional)</span></label>
                  <input
                    id="subject" type="text"
                    placeholder="e.g. Report a User, Listing Issue…"
                    value={form.subject}
                    onChange={handleChange}
                  />
                </div>

                {/* Message */}
                <div className="form-group">
                  <label htmlFor="message">Message <span className="req">*</span></label>
                  <textarea
                    id="message" rows={5}
                    placeholder="Describe your issue or question in detail…"
                    value={form.message}
                    onChange={handleChange}
                    className={errors.message ? "input-error" : ""}
                  />
                  {errors.message && <span className="error-msg">{errors.message}</span>}
                </div>

                <button className="submit-btn" onClick={handleSubmit}>
                  Submit Request →
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
