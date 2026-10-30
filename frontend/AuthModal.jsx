
import { useState } from "react";
import "./AuthModal.css";

// Local API for now. Update after backend deployment.
const API_URL = "http://localhost:5000";

export default function AuthModal({
  mode,
  onClose,
  onSwitch,
  onAuthSuccess,
}) {
  const isSignup = mode === "signup";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup && form.name.trim().length < 2) {
      setMessage("Please enter your full name.");
      return;
    }

    if (form.password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    if (isSignup && form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const endpoint = isSignup ? "signup" : "login";

      const body = isSignup
        ? {
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
          }
        : {
            email: form.email.trim(),
            password: form.password,
          };

      const response = await fetch(
        `${API_URL}/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      if (data.token) {
        localStorage.setItem("learnverse_token", data.token);
      }

      if (data.user) {
        localStorage.setItem(
          "learnverse_user",
          JSON.stringify(data.user)
        );
      }

      onAuthSuccess?.(data.user);
      onClose();
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div
        className="auth-box"
        role="dialog"
        aria-modal="true"
        aria-label={isSignup ? "Create account" : "Login"}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="auth-close"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <div className="auth-logo">
          ✦ Learn<span>Verse</span>
        </div>

        <h2>
          {isSignup ? "Create your account" : "Welcome back!"}
        </h2>

        <p className="auth-subtitle">
          {isSignup
            ? "Start your learning journey today."
            : "Sign in to continue learning."}
        </p>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="auth-field">
              <label htmlFor="auth-name">Full Name</label>
              <input
                id="auth-name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete={
                isSignup ? "new-password" : "current-password"
              }
              required
            />
          </div>

          {isSignup && (
            <div className="auth-field">
              <label htmlFor="auth-confirm">Confirm Password</label>
              <input
                id="auth-confirm"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>
          )}

          {message && (
            <p className="auth-message" role="status">
              {message}
            </p>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? "Create Account"
              : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            type="button"
            onClick={() => {
              setMessage("");
              onSwitch(isSignup ? "login" : "signup");
            }}
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
