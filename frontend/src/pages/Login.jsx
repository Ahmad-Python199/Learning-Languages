import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { Cpu, Mail, Lock, AlertTriangle } from "lucide-react";
import GlowingBackground from "../components/GlowingBackground";

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Google authentication failed");
    } finally {
      setLoading(false);
    }
  };

  // Callback to simulate Google SSO login when Client ID is missing or for rapid testing
  const handleMockGoogleSSO = async () => {
    setError("");
    setLoading(true);
    const mockEmail = prompt("Enter mock email address for Google SSO simulation:", "student@skillsphere.com");
    if (!mockEmail) {
      setLoading(false);
      return;
    }
    try {
      // Send token prefixed with mock flag
      await loginWithGoogle(`mock_google_token_${mockEmail}`);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Mock Google authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "var(--bg-dark)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "1.5rem",
      position: "relative"
    }}>
      <GlowingBackground />

      <div className="glass-panel" style={{
        width: "100%",
        maxWidth: "420px",
        padding: "2.5rem",
        background: "var(--bg-glass)",
        border: "1px solid rgba(139, 92, 246, 0.2)",
        position: "relative",
        zIndex: 5
      }}>
        {/* Brand Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 0 20px 0 var(--accent-purple-glow)"
          }}>
            <Cpu size={22} color="#050508" strokeWidth={2.5} />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Welcome Back</h2>
          <span style={{ fontSize: "0.8rem", color: "var(--text-dark)", fontWeight: 500 }}>Sign in to continue your path</span>
        </div>

        {error && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "#f87171",
            padding: "0.75rem",
            borderRadius: "var(--border-radius-sm)",
            fontSize: "0.85rem",
            marginBottom: "1.5rem"
          }}>
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.4rem" }}>Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail size={16} color="var(--text-dark)" style={{ position: "absolute", left: "1rem", top: "1.1rem" }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ paddingLeft: "2.75rem" }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)" }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: "0.8rem", color: "var(--accent-cyan)", textDecoration: "none", fontWeight: 500 }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <Lock size={16} color="var(--text-dark)" style={{ position: "absolute", left: "1rem", top: "1.1rem" }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingLeft: "2.75rem" }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", padding: "0.85rem", marginTop: "0.5rem" }}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.5rem 0" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border-muted)" }} />
          <span style={{ fontSize: "0.75rem", color: "var(--text-dark)", fontWeight: 600 }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border-muted)" }} />
        </div>

        {/* Google OAuth Login Button Wrapper */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
          <div style={{ width: "100%" }}>
            {/* The GoogleLogin button will render if credentials are set, but for testing we provide a custom styled button */}
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login error")}
              theme="dark"
              size="large"
              text="signin_with"
              shape="rectangular"
              width="100%"
            />
          </div>
          
          {/* Mock Google Login Trigger */}
          <button
            onClick={handleMockGoogleSSO}
            className="btn btn-secondary"
            style={{
              width: "100%",
              justifyContent: "center",
              fontSize: "0.85rem",
              background: "rgba(6, 182, 212, 0.05)",
              border: "1px dashed rgba(6, 182, 212, 0.3)",
              color: "var(--accent-cyan)"
            }}
          >
            💻 Simulate Google OAuth (Developer Test)
          </button>
        </div>

        {/* Signup Link */}
        <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "var(--accent-purple)", textDecoration: "none", fontWeight: 600 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
