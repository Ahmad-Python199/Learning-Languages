import React from "react";
import { Play, Bookmark, BookmarkCheck } from "lucide-react";

const VideoCard = ({ video, isBookmarked, onBookmarkToggle }) => {
  const getDifficultyColor = (diff) => {
    switch (diff.toLowerCase()) {
      case "beginner":
        return "#10b981"; // green
      case "intermediate":
        return "#f59e0b"; // amber
      case "advanced":
        return "#ef4444"; // red
      default:
        return "var(--accent-cyan)";
    }
  };

  const getLanguageFlag = (lang) => {
    switch (lang.toLowerCase()) {
      case "english":
        return "🇬🇧 EN";
      case "urdu":
        return "🇵🇰 UR";
      case "hindi":
        return "🇮🇳 HI";
      default:
        return lang;
    }
  };

  return (
    <div className="glass-panel glow-card" style={{
      padding: "1.25rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      position: "relative"
    }}>
      {/* Upper Meta Flags */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          background: "rgba(255,255,255,0.05)",
          padding: "0.25rem 0.5rem",
          borderRadius: "4px",
          color: "var(--text-muted)"
        }}>
          {getLanguageFlag(video.language)}
        </span>
        <span style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: getDifficultyColor(video.difficulty)
        }}>
          {video.difficulty}
        </span>
      </div>

      {/* Title & Channel */}
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontSize: "1rem",
          fontWeight: 700,
          lineHeight: 1.4,
          marginBottom: "0.4rem",
          color: "var(--text-main)",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        }}>
          {video.title}
        </h3>
        <p style={{ fontSize: "0.8rem", color: "var(--text-dark)", fontWeight: 500 }}>
          {video.channel_name || "Unknown Channel"}
        </p>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{
            flex: 1,
            justifyContent: "center",
            padding: "0.5rem 1rem",
            fontSize: "0.85rem",
            borderRadius: "var(--border-radius-sm)"
          }}
        >
          <Play size={14} fill="currentColor" />
          <span>Watch</span>
        </a>

        <button
          onClick={() => onBookmarkToggle(video.id)}
          className="btn btn-secondary"
          style={{
            padding: "0.5rem",
            borderRadius: "var(--border-radius-sm)",
            borderColor: isBookmarked ? "var(--accent-cyan)" : "var(--border-muted)"
          }}
          title={isBookmarked ? "Remove Bookmark" : "Save Resource"}
        >
          {isBookmarked ? (
            <BookmarkCheck size={16} color="var(--accent-cyan)" />
          ) : (
            <Bookmark size={16} color="var(--text-muted)" />
          )}
        </button>
      </div>
    </div>
  );
};

export default VideoCard;
