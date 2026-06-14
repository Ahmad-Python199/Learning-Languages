import React from "react";
import { ExternalLink, Code2 } from "lucide-react";

const PracticeCard = ({ challenge }) => {
  const getDifficultyColor = (diff) => {
    switch (diff.toLowerCase()) {
      case "easy":
        return "#10b981"; // green
      case "medium":
        return "#f59e0b"; // amber
      case "hard":
        return "#ef4444"; // red
      default:
        return "var(--accent-cyan)";
    }
  };

  const getPlatformBadge = (plat) => {
    switch (plat.toLowerCase()) {
      case "leetcode":
        return { text: "LeetCode", bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.3)", color: "#f59e0b" };
      case "hackerrank":
        return { text: "HackerRank", bg: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.3)", color: "#10b981" };
      case "w3schools":
        return { text: "W3Schools", bg: "rgba(6, 182, 212, 0.15)", border: "rgba(6, 182, 212, 0.3)", color: "#06b6d4" };
      default:
        return { text: plat, bg: "rgba(255,255,255,0.05)", border: "var(--border-muted)", color: "var(--text-muted)" };
    }
  };

  const badge = getPlatformBadge(challenge.platform);

  return (
    <div className="glass-panel glow-card" style={{
      padding: "1.25rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      gap: "1.25rem",
      height: "100%"
    }}>
      {/* Header Meta */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          background: badge.bg,
          border: `1px solid ${badge.border}`,
          padding: "0.25rem 0.6rem",
          borderRadius: "30px",
          color: badge.color
        }}>
          {badge.text}
        </span>
        <span style={{
          fontSize: "0.8rem",
          fontWeight: 700,
          color: getDifficultyColor(challenge.difficulty)
        }}>
          {challenge.difficulty}
        </span>
      </div>

      {/* Title & Topic */}
      <div style={{ flex: 1 }}>
        <h4 style={{
          fontSize: "0.95rem",
          fontWeight: 700,
          lineHeight: 1.4,
          color: "var(--text-main)",
          marginBottom: "0.5rem"
        }}>
          {challenge.title}
        </h4>
        <span style={{
          fontSize: "0.75rem",
          color: "var(--text-dark)",
          background: "rgba(255,255,255,0.03)",
          padding: "0.2rem 0.5rem",
          borderRadius: "4px",
          border: "1px solid var(--border-muted)",
          display: "inline-block"
        }}>
          Topic: {challenge.topic}
        </span>
      </div>

      {/* Action Solve Link */}
      <a
        href={challenge.url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-accent"
        style={{
          width: "100%",
          justifyContent: "center",
          padding: "0.5rem 1rem",
          fontSize: "0.85rem",
          borderRadius: "var(--border-radius-sm)"
        }}
      >
        <Code2 size={14} />
        <span>Solve Challenge</span>
        <ExternalLink size={12} style={{ marginLeft: "2px" }} />
      </a>
    </div>
  );
};

export default PracticeCard;
