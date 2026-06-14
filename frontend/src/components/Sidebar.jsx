import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  BookOpen, 
  Code2, 
  MessageSquareCode, 
  User, 
  Settings, 
  LogOut, 
  Cpu 
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Skills & Roadmaps", path: "/skills", icon: BookOpen },
    { name: "Coding Practice", path: "/practice", icon: Code2 },
    { name: "AI Assistant", path: "/chat", icon: MessageSquareCode },
    { name: "My Profile", path: "/profile", icon: User },
  ];

  if (user && user.role === "admin") {
    menuItems.push({ name: "Admin Panel", path: "/admin", icon: Settings });
  }

  return (
    <aside className="glass-panel" style={{
      position: "fixed",
      top: 0,
      left: 0,
      bottom: 0,
      width: "260px",
      borderRadius: 0,
      borderRight: "1px solid var(--border-muted)",
      borderTop: "none",
      borderBottom: "none",
      borderLeft: "none",
      display: "flex",
      flexDirection: "column",
      zIndex: 10,
      padding: "1.5rem"
    }}>
      {/* Brand Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginBottom: "2.5rem",
        padding: "0.5rem"
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 0 15px 0 var(--accent-purple-glow)"
        }}>
          <Cpu size={20} color="#050508" strokeWidth={2.5} />
        </div>
        <div>
          <h1 style={{
            fontSize: "1.4rem",
            fontWeight: 800,
            letterSpacing: "-0.5px",
            background: "linear-gradient(to right, var(--text-main), #cbd5e1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>SkillSphere</h1>
          <span style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", fontWeight: 600 }}>AI Platform</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.85rem 1rem",
                borderRadius: "var(--border-radius-sm)",
                color: isActive ? "white" : "var(--text-muted)",
                textDecoration: "none",
                fontWeight: isActive ? 600 : 500,
                background: isActive ? "linear-gradient(90deg, rgba(139, 92, 246, 0.15) 0%, transparent 100%)" : "transparent",
                borderLeft: isActive ? "3px solid var(--accent-purple)" : "3px solid transparent",
                transition: "var(--transition-smooth)"
              }}
              className="sidebar-link"
            >
              <Icon size={18} color={isActive ? "var(--accent-purple)" : "var(--text-dark)"} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer User Profile & Logout */}
      {user && (
        <div style={{
          borderTop: "1px solid var(--border-muted)",
          paddingTop: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "rgba(139, 92, 246, 0.1)",
              border: "1px solid var(--border-muted)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              color: "var(--accent-cyan)"
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                {user.name}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dark)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                {user.email}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              width: "100%",
              background: "rgba(239, 68, 68, 0.05)",
              color: "#f87171",
              border: "1px solid rgba(239, 68, 68, 0.15)",
              padding: "0.6rem",
              borderRadius: "var(--border-radius-sm)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 600
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
