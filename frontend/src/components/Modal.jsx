import React, { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(3, 3, 5, 0.8)",
      backdropFilter: "blur(8px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 100,
      padding: "1.5rem"
    }} onClick={onClose}>
      <div 
        className="glass-panel" 
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "var(--bg-deep)",
          padding: "2rem",
          position: "relative",
          boxShadow: "0 10px 40px 0 rgba(139, 92, 246, 0.15)",
          border: "1px solid rgba(139, 92, 246, 0.25)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          borderBottom: "1px solid var(--border-muted)",
          paddingBottom: "0.75rem"
        }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "white" }}>{title}</h3>
          <button 
            onClick={onClose} 
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.25rem",
              borderRadius: "4px",
              color: "var(--text-muted)"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "white"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
