import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BookOpen, Compass, Award, Star, ArrowRight } from "lucide-react";

const Skills = () => {
  const { authFetch } = useAuth();
  const [skills, setSkills] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search/Filter states
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const loadSkillsData = async () => {
      try {
        setLoading(true);
        const [skillsData, progressData] = await Promise.all([
          authFetch("/api/skills"),
          authFetch("/api/progress")
        ]);
        setSkills(skillsData);
        setProgressRecords(progressData);
      } catch (err) {
        console.error("Failed to load skills catalog:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSkillsData();
  }, []);

  const getProgressForSkill = (skillId) => {
    const record = progressRecords.find(p => p.skill_id === skillId);
    return record ? record.completion_percentage : 0;
  };

  // Categories
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "Programming Languages", name: "Programming Languages" },
    { id: "Web Development", name: "Web Development" },
    { id: "AI & Data", name: "AI & Data" },
    { id: "Other Skills", name: "Other Skills" }
  ];

  const filteredSkills = selectedCategory === "all"
    ? skills
    : skills.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Page Header */}
      <div>
        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>Skill Curriculum</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Select a skill to explore interactive step-by-step roadmaps, tutorials, and practice questions.
        </p>
      </div>

      {/* Category selector panel */}
      <section className="glass-panel" style={{
        padding: "1rem 1.5rem",
        display: "flex",
        gap: "0.5rem",
        flexWrap: "wrap",
        alignItems: "center"
      }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className="btn btn-secondary"
            style={{
              padding: "0.45rem 1rem",
              fontSize: "0.85rem",
              background: selectedCategory === cat.id ? "rgba(139, 92, 246, 0.15)" : "rgba(255,255,255,0.02)",
              borderColor: selectedCategory === cat.id ? "var(--accent-purple)" : "var(--border-muted)",
              color: selectedCategory === cat.id ? "white" : "var(--text-muted)",
              borderRadius: "var(--border-radius-sm)"
            }}
          >
            {cat.name}
          </button>
        ))}
      </section>

      {/* Skills list grid */}
      {loading ? (
        <div style={{ textAlign: "center", color: "var(--accent-purple)", padding: "4rem" }} className="pulse-glow">
          Loading curriculums...
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
          gap: "1.5rem"
        }}>
          {filteredSkills.map((s) => {
            const skillProgress = getProgressForSkill(s.id);
            return (
              <div
                key={s.id}
                className="glass-panel glow-card"
                style={{
                  padding: "1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "1.5rem",
                  height: "240px",
                  background: "rgba(13, 13, 29, 0.45)"
                }}
              >
                <div>
                  {/* Category Tag */}
                  <span style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "var(--accent-cyan)",
                    background: "rgba(6, 182, 212, 0.08)",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "4px",
                    display: "inline-block",
                    marginBottom: "0.75rem"
                  }}>
                    {s.category}
                  </span>

                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "white", marginBottom: "0.4rem" }}>
                    {s.name}
                  </h3>
                  <p style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                    {s.description}
                  </p>
                </div>

                {/* Progress bar and Go button */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <div style={{ flex: 1, marginRight: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-dark)", marginBottom: "0.2rem", fontWeight: 600 }}>
                        <span>Progress</span>
                        <span>{Math.round(skillProgress)}%</span>
                      </div>
                      <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.04)", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ width: `${skillProgress}%`, height: "100%", background: "linear-gradient(to right, var(--accent-purple), var(--accent-cyan))" }} />
                      </div>
                    </div>
                    
                    <Link
                      to={`/skills/${s.id}`}
                      className="btn btn-primary"
                      style={{
                        padding: "0.5rem",
                        borderRadius: "var(--border-radius-sm)",
                        flexShrink: 0
                      }}
                      title="Enter Roadmap"
                    >
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default Skills;
