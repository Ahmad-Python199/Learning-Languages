import React from "react";
import { Link } from "react-router-dom";
import { Cpu, Code, BookOpen, MessageSquare, Award, ArrowRight } from "lucide-react";
import GlowingBackground from "../components/GlowingBackground";

const Landing = () => {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "var(--bg-dark)",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "2rem"
    }}>
      <GlowingBackground />

      {/* Header / Brand */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "1200px",
        width: "100%",
        margin: "0 auto",
        zIndex: 5
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <Cpu size={18} color="#050508" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.5px" }}>SkillSphere</span>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/login" className="btn btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
            Sign In
          </Link>
          <Link to="/signup" className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{
        maxWidth: "1200px",
        width: "100%",
        margin: "4rem auto",
        zIndex: 5,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "4rem",
        alignItems: "center"
      }} className="landing-main">
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(139, 92, 246, 0.1)",
            padding: "0.35rem 0.75rem",
            borderRadius: "50px",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            color: "var(--accent-purple)",
            fontSize: "0.8rem",
            fontWeight: 700,
            width: "fit-content"
          }}>
            🚀 Future of Learning is Here
          </div>
          <h2 style={{
            fontSize: "3.5rem",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-1px"
          }}>
            Master Technical Skills with <span style={{
              background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>AI Intelligence</span>
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", lineHeight: 1.6 }}>
            An all-in-one ecosystem for developers. Follow interactive roadmaps, watch curated video resources, solve coding challenges, and chat with a dedicated AI software tutor.
          </p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <Link to="/signup" className="btn btn-accent" style={{ padding: "0.9rem 2rem" }}>
              <span>Start Learning Free</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Right column (Futuristic feature showcase card) */}
        <div className="glass-panel" style={{
          padding: "2.5rem",
          background: "rgba(13, 13, 29, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          boxShadow: "0 20px 50px rgba(139, 92, 246, 0.05)"
        }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--accent-cyan)" }}>Ecosystem Modules</h3>
          
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "rgba(6, 182, 212, 0.1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0
            }}>
              <BookOpen size={20} color="var(--accent-cyan)" />
            </div>
            <div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>20+ Skill Roadmaps</h4>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Explore beginner to advanced syllabus for Python, React, Deep Learning, UI/UX, and cloud.</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "rgba(139, 92, 246, 0.1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0
            }}>
              <Code size={20} color="var(--accent-purple)" />
            </div>
            <div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Practice Integration</h4>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Solve coding problems on LeetCode, HackerRank, and W3Schools with curated filters.</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "rgba(236, 72, 153, 0.1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0
            }}>
              <MessageSquare size={20} color="var(--accent-pink)" />
            </div>
            <div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>OpenRouter AI Support</h4>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Get instant explanations of complex topics and diagnose syntax errors on code snippets.</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "rgba(16, 185, 129, 0.1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0
            }}>
              <Award size={20} color="#10b981" />
            </div>
            <div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Streaks and Certificates</h4>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Maintain your daily learning streak, earn digital achievement badges, and unlock master certificates.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        maxWidth: "1200px",
        width: "100%",
        margin: "0 auto",
        borderTop: "1px solid var(--border-muted)",
        paddingTop: "1.5rem",
        zIndex: 5,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "0.8rem",
        color: "var(--text-dark)"
      }}>
        <div>&copy; 2026 SkillSphere. All rights reserved. Built for developers.</div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Terms</a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Support</a>
        </div>
      </footer>
      
      {/* Styles for responsiveness */}
      <style>{`
        @media (max-width: 768px) {
          .landing-main {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            text-align: center;
          }
          .landing-main h2 {
            font-size: 2.5rem !important;
          }
          .landing-main div {
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Landing;
