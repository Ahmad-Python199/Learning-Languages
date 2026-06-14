import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Search, Bell, Menu, X, BookOpen, Video, Code } from "lucide-react";

const Navbar = ({ onToggleSidebar }) => {
  const { authFetch, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [skills, setSkills] = useState([]);
  const [resources, setResources] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Load all searchable entities
  useEffect(() => {
    const loadSearchData = async () => {
      try {
        if (!user) return;
        const skillsData = await authFetch("/api/skills");
        setSkills(skillsData);
        const resourcesData = await authFetch("/api/resources");
        setResources(resourcesData);
      } catch (err) {
        console.error("Error loading search data:", err);
      }
    };
    loadSearchData();
  }, [user]);

  // Handle Search Input Logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const matches = [];

    // Search in Skills
    skills.forEach(s => {
      if (
        s.name.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query)
      ) {
        matches.push({ type: "skill", id: s.id, title: s.name, subtitle: s.category });
      }
    });

    // Search in Resources
    resources.forEach(r => {
      if (
        r.title.toLowerCase().includes(query) ||
        r.platform.toLowerCase().includes(query) ||
        r.difficulty.toLowerCase().includes(query) ||
        r.language.toLowerCase().includes(query)
      ) {
        matches.push({ type: "resource", id: r.skill_id, title: r.title, subtitle: `${r.platform} • ${r.language} • ${r.difficulty}` });
      }
    });

    setSearchResults(matches.slice(0, 8)); // limit results
  }, [searchQuery, skills, resources]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (result) => {
    setShowDropdown(false);
    setSearchQuery("");
    if (result.type === "skill") {
      navigate(`/skills/${result.id}`);
    } else if (result.type === "resource") {
      navigate(`/skills/${result.id}?tab=resources`);
    }
  };

  return (
    <header className="glass-panel" style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "70px",
      borderRadius: 0,
      borderTop: "none",
      borderLeft: "none",
      borderRight: "none",
      borderBottom: "1px solid var(--border-muted)",
      zIndex: 9,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 2rem",
      background: "rgba(5, 5, 8, 0.7)",
      backdropFilter: "blur(12px)"
    }}>
      {/* Sidebar toggle for mobile */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button 
          onClick={onToggleSidebar}
          className="btn-secondary"
          style={{
            display: "none",
            padding: "0.5rem",
            borderRadius: "var(--border-radius-sm)",
            cursor: "pointer"
          }}
          id="mobile-nav-toggle"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Global Search System */}
      <div ref={dropdownRef} style={{ position: "relative", width: "40%", maxWidth: "450px" }}>
        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
          <Search size={18} color="var(--text-dark)" style={{ position: "absolute", left: "1rem" }} />
          <input
            type="text"
            placeholder="Search skills, tutorials, difficulty..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            style={{
              paddingLeft: "2.75rem",
              borderRadius: "50px",
              height: "40px",
              fontSize: "0.9rem",
              background: "rgba(13, 13, 29, 0.5)",
              border: "1px solid var(--border-muted)"
            }}
          />
        </div>

        {/* Floating Dropdown Results */}
        {showDropdown && searchResults.length > 0 && (
          <div className="glass-panel" style={{
            position: "absolute",
            top: "50px",
            left: 0,
            right: 0,
            maxHeight: "350px",
            overflowY: "auto",
            padding: "0.5rem",
            background: "var(--bg-deep)",
            border: "1px solid rgba(139, 92, 246, 0.2)"
          }}>
            {searchResults.map((res, i) => (
              <div
                key={i}
                onClick={() => handleResultClick(res)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem",
                  borderRadius: "var(--border-radius-sm)",
                  cursor: "pointer",
                  transition: "var(--transition-smooth)"
                }}
                className="search-item"
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <div style={{
                  color: res.type === "skill" ? "var(--accent-cyan)" : "var(--accent-purple)"
                }}>
                  {res.type === "skill" ? <BookOpen size={16} /> : <Video size={16} />}
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>
                    {res.title}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-dark)" }}>
                    {res.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notifications and Profile shortcuts */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Streak Counter display */}
        {user && user.streak_count > 0 && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            background: "rgba(236, 72, 153, 0.1)",
            padding: "0.35rem 0.75rem",
            borderRadius: "50px",
            border: "1px solid rgba(236, 72, 153, 0.2)",
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "var(--accent-pink)"
          }}>
            🔥 {user.streak_count} Day Streak
          </div>
        )}

        <div style={{
          position: "relative",
          cursor: "pointer",
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid var(--border-muted)"
        }}>
          <Bell size={18} color="var(--text-muted)" />
          <div style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "var(--accent-pink)"
          }} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
