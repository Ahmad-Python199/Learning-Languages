import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../context/AuthContext";
import { Cpu, Mail, Lock, Key, AlertTriangle, CheckCircle, Info } from "lucide-react";
import GlowingBackground from "../components/GlowingBackground";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter Code & New Password
  const [demoCode, setDemoCode] = useState(""); // Visual simulation helper
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Email address not found");
      }

      const data = await response.json();
      setSuccess("Simulated reset code generated successfully.");
      
      // Store the code returned in the demo payload
      if (data.temp_code_for_demo) {
        setDemoCode(data.temp_code_for_demo);
      }
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          temp_code: code,
          new_password: password
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Invalid code or password reset parameters");
      }

      setSuccess("Password reset successfully. Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      setError(err.message || "Failed to reset password");
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
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Reset Password</h2>
          <span style={{ fontSize: "0.8rem", color: "var(--text-dark)", fontWeight: 500 }}>
            {step === 1 ? "Enter your email to receive a code" : "Enter code and set new password"}
          </span>
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

        {success && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            color: "#34d399",
            padding: "0.75rem",
            borderRadius: "var(--border-radius-sm)",
            fontSize: "0.85rem",
            marginBottom: "1.5rem"
          }}>
            <CheckCircle size={16} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* Developer Sandbox Code Display */}
        {demoCode && (
          <div style={{
            background: "rgba(6, 182, 212, 0.08)",
            border: "1px solid rgba(6, 182, 212, 0.2)",
            padding: "0.85rem",
            borderRadius: "var(--border-radius-sm)",
            marginBottom: "1.5rem",
            display: "flex",
            gap: "0.5rem",
            alignItems: "flex-start"
          }}>
            <Info size={16} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontSize: "0.8rem", color: "var(--accent-cyan)", fontWeight: 700 }}>Simulated Dispatch Info</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                Since this is running in sandbox/testing, the reset code is: 
                <strong style={{ color: "white", background: "rgba(255,255,255,0.08)", padding: "0.1rem 0.3rem", borderRadius: "3px", marginLeft: "4px" }}>
                  {demoCode}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Request Code */}
        {step === 1 && (
          <form onSubmit={handleRequestCode} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
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

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", padding: "0.85rem", marginTop: "0.5rem" }}
            >
              {loading ? "Sending..." : "Request Reset Code"}
            </button>
          </form>
        )}

        {/* Step 2: Input Code & Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.4rem" }}>Reset Code (6-digit)</label>
              <div style={{ position: "relative" }}>
                <Key size={16} color="var(--text-dark)" style={{ position: "absolute", left: "1rem", top: "1.1rem" }} />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={{ paddingLeft: "2.75rem", letterSpacing: "4px", fontWeight: "bold" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.4rem" }}>New Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="var(--text-dark)" style={{ position: "absolute", left: "1rem", top: "1.1rem" }} />
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* Back Link */}
        <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.85rem" }}>
          <Link to="/login" style={{ color: "var(--text-dark)", textDecoration: "none", fontWeight: 600 }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
