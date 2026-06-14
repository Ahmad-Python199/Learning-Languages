import React, { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  ArrowLeft, 
  Map, 
  BookOpen, 
  Video, 
  Code2, 
  CheckCircle, 
  BookMarked,
  Sparkles,
  Flame,
  Award
} from "lucide-react";
import VideoCard from "../components/VideoCard";
import PracticeCard from "../components/PracticeCard";

const SkillDetail = () => {
  const { skill_id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { authFetch, user, triggerProfileRefresh } = useAuth();
  
  // Data states
  const [skill, setSkill] = useState(null);
  const [progress, setProgress] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  
  // UI states
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "roadmap");
  const [videoLang, setVideoLang] = useState("all");
  const [checkedNodes, setCheckedNodes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync tab param in URL
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const changeTab = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ tab: tabName });
  };

  // Fetch skill details, progress, and bookmarks
  const loadSkillData = async () => {
    try {
      setLoading(true);
      const [skillData, progressData, bookmarksData] = await Promise.all([
        authFetch(`/api/skills/${skill_id}`),
        authFetch(`/api/progress/${skill_id}`),
        authFetch("/api/resources/bookmarks")
      ]);

      setSkill(skillData);
      setProgress(progressData);
      setBookmarks(bookmarksData.map(b => b.resource_id));
      
      if (progressData && progressData.completed_nodes_json) {
        setCheckedNodes(JSON.parse(progressData.completed_nodes_json));
      }
    } catch (err) {
      console.error("Error loading skill details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkillData();
  }, [skill_id]);

  // Handle roadmap checkbox click
  const handleNodeToggle = async (nodeTitle) => {
    const isCompleted = !checkedNodes.includes(nodeTitle);
    
    // Optimistic UI update
    const updatedCheckedNodes = isCompleted 
      ? [...checkedNodes, nodeTitle] 
      : checkedNodes.filter(n => n !== nodeTitle);
    setCheckedNodes(updatedCheckedNodes);

    try {
      const updatedProgress = await authFetch(`/api/progress/${skill_id}`, {
        method: "PUT",
        body: JSON.stringify({
          completed_node: nodeTitle,
          completed: isCompleted
        })
      });
      setProgress(updatedProgress);
      // Refresh user stats (streak count, badges) in Auth Context
      await triggerProfileRefresh();
    } catch (err) {
      console.error("Error updating node progress:", err);
      // Revert UI on failure
      setCheckedNodes(checkedNodes);
    }
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = async (resourceId) => {
    const isBookmarked = bookmarks.includes(resourceId);
    try {
      if (isBookmarked) {
        await authFetch(`/api/resources/${resourceId}/bookmark`, { method: "DELETE" });
        setBookmarks(bookmarks.filter(id => id !== resourceId));
      } else {
        await authFetch(`/api/resources/${resourceId}/bookmark`, { method: "POST" });
        setBookmarks([...bookmarks, resourceId]);
      }
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", color: "var(--accent-purple)" }} className="pulse-glow">
        Loading syllabus elements...
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="glass-panel" style={{ padding: "2rem", textAlign: "center" }}>
        <h3>Skill syllabus not found.</h3>
        <Link to="/skills" className="btn btn-secondary" style={{ marginTop: "1rem" }}>
          Back to Skill Hub
        </Link>
      </div>
    );
  }

  // Parse roadmap contents
  const roadmap = JSON.parse(skill.roadmap_json || "{}");
  const introduction = roadmap.introduction || skill.description;
  const beginnerNodes = roadmap.beginner || [];
  const intermediateNodes = roadmap.intermediate || [];
  const advancedNodes = roadmap.advanced || [];
  const concepts = roadmap.concepts || [];

  // Filter video resources
  const filteredVideos = skill.resources.filter(video => {
    if (videoLang === "all") return true;
    return video.language.toLowerCase() === videoLang.toLowerCase();
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Upper Back Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/skills" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", textDecoration: "none", fontWeight: 600 }}>
          <ArrowLeft size={16} />
          <span>Back to Skill Hub</span>
        </Link>
        <span style={{ fontSize: "0.85rem", color: "var(--accent-cyan)", fontWeight: 700, textTransform: "uppercase", background: "rgba(6, 182, 212, 0.1)", padding: "0.25rem 0.75rem", borderRadius: "50px" }}>
          {skill.category}
        </span>
      </div>

      {/* Course Title Card */}
      <section className="glass-panel" style={{
        padding: "2.5rem",
        background: "linear-gradient(135deg, rgba(13, 13, 29, 0.65) 0%, rgba(6, 182, 212, 0.05) 100%)",
        border: "1px solid var(--border-muted)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }} className="skill-hero">
        <div style={{ flex: 1, paddingRight: "2rem" }}>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "0.75rem" }}>{skill.name} Roadmap</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>{introduction}</p>
        </div>

        {/* Dynamic Progress Ring */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          <div style={{
            position: "relative",
            width: "100px",
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            {/* SVG Progress Circle */}
            <svg style={{ transform: "rotate(-90deg)", width: "100px", height: "100px" }}>
              <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.04)" strokeWidth="8" fill="transparent" />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                stroke="var(--accent-purple)" 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * (progress?.completion_percentage || 0)) / 100}
                style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
              />
            </svg>
            <div style={{ position: "absolute", fontSize: "1.1rem", fontWeight: 800 }}>
              {Math.round(progress?.completion_percentage || 0)}%
            </div>
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Course Progress</span>
        </div>
      </section>

      {/* Tabs Menu */}
      <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid var(--border-muted)", paddingBottom: "0.5rem" }}>
        {[
          { id: "roadmap", name: "Roadmap Syllabus", icon: Map },
          { id: "resources", name: "YouTube Tutorials", icon: Video },
          { id: "practice", name: "Practice Challenges", icon: Code2 },
          { id: "concepts", name: "Important Concepts", icon: BookOpen }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => changeTab(tab.id)}
              style={{
                background: "transparent",
                color: isActive ? "white" : "var(--text-muted)",
                border: "none",
                padding: "0.75rem 1rem",
                fontSize: "0.95rem",
                fontWeight: isActive ? 700 : 500,
                borderBottom: isActive ? "2px solid var(--accent-purple)" : "2px solid transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                borderRadius: 0
              }}
            >
              <Icon size={16} color={isActive ? "var(--accent-purple)" : "var(--text-dark)"} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div>
        
        {/* Roadmap Tab */}
        {activeTab === "roadmap" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            
            {/* Beginner */}
            <div className="glass-panel" style={{ padding: "2rem" }}>
              <h3 style={{ fontSize: "1.1rem", color: "var(--accent-cyan)", fontWeight: 800, marginBottom: "1.5rem", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <CheckCircle size={16} />
                <span>Beginner Milestone</span>
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {beginnerNodes.map((node, i) => (
                  <div 
                    key={i} 
                    onClick={() => handleNodeToggle(node.title)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1.25rem",
                      padding: "1.25rem",
                      borderRadius: "var(--border-radius-sm)",
                      border: "1px solid var(--border-muted)",
                      background: checkedNodes.includes(node.title) ? "rgba(139, 92, 246, 0.03)" : "rgba(255,255,255,0.01)",
                      cursor: "pointer",
                      transition: "var(--transition-smooth)"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.25)"}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-muted)"}
                  >
                    <input 
                      type="checkbox" 
                      checked={checkedNodes.includes(node.title)} 
                      onChange={() => {}} // handled by div click
                      style={{ width: "20px", height: "20px", cursor: "pointer", flexShrink: 0, marginTop: "2px" }} 
                    />
                    <div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 700, textDecoration: checkedNodes.includes(node.title) ? "line-through" : "none", color: checkedNodes.includes(node.title) ? "var(--text-muted)" : "white" }}>
                        {node.title}
                      </h4>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-dark)", marginTop: "0.25rem" }}>{node.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Intermediate */}
            <div className="glass-panel" style={{ padding: "2rem" }}>
              <h3 style={{ fontSize: "1.1rem", color: "var(--accent-purple)", fontWeight: 800, marginBottom: "1.5rem", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <CheckCircle size={16} />
                <span>Intermediate Milestone</span>
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {intermediateNodes.map((node, i) => (
                  <div 
                    key={i} 
                    onClick={() => handleNodeToggle(node.title)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1.25rem",
                      padding: "1.25rem",
                      borderRadius: "var(--border-radius-sm)",
                      border: "1px solid var(--border-muted)",
                      background: checkedNodes.includes(node.title) ? "rgba(139, 92, 246, 0.03)" : "rgba(255,255,255,0.01)",
                      cursor: "pointer",
                      transition: "var(--transition-smooth)"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.25)"}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-muted)"}
                  >
                    <input 
                      type="checkbox" 
                      checked={checkedNodes.includes(node.title)} 
                      onChange={() => {}} 
                      style={{ width: "20px", height: "20px", cursor: "pointer", flexShrink: 0, marginTop: "2px" }} 
                    />
                    <div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 700, textDecoration: checkedNodes.includes(node.title) ? "line-through" : "none", color: checkedNodes.includes(node.title) ? "var(--text-muted)" : "white" }}>
                        {node.title}
                      </h4>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-dark)", marginTop: "0.25rem" }}>{node.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced */}
            <div className="glass-panel" style={{ padding: "2rem" }}>
              <h3 style={{ fontSize: "1.1rem", color: "var(--accent-pink)", fontWeight: 800, marginBottom: "1.5rem", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <CheckCircle size={16} />
                <span>Advanced Milestone</span>
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {advancedNodes.map((node, i) => (
                  <div 
                    key={i} 
                    onClick={() => handleNodeToggle(node.title)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1.25rem",
                      padding: "1.25rem",
                      borderRadius: "var(--border-radius-sm)",
                      border: "1px solid var(--border-muted)",
                      background: checkedNodes.includes(node.title) ? "rgba(139, 92, 246, 0.03)" : "rgba(255,255,255,0.01)",
                      cursor: "pointer",
                      transition: "var(--transition-smooth)"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.25)"}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-muted)"}
                  >
                    <input 
                      type="checkbox" 
                      checked={checkedNodes.includes(node.title)} 
                      onChange={() => {}} 
                      style={{ width: "20px", height: "20px", cursor: "pointer", flexShrink: 0, marginTop: "2px" }} 
                    />
                    <div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 700, textDecoration: checkedNodes.includes(node.title) ? "line-through" : "none", color: checkedNodes.includes(node.title) ? "var(--text-muted)" : "white" }}>
                        {node.title}
                      </h4>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-dark)", marginTop: "0.25rem" }}>{node.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick AI shortcut trigger */}
            <div className="glass-panel" style={{ padding: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px dashed rgba(139, 92, 246, 0.3)" }}>
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Sparkles size={16} color="var(--accent-purple)" />
                  <span>Stuck on any syllabus topic?</span>
                </h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Engage our AI Platform assistant to explain concepts or debug code directly.</p>
              </div>
              <Link to={`/chat?skill=${skill.id}`} className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
                Consult AI Tutor
              </Link>
            </div>

          </div>
        )}

        {/* YouTube Tutorials Tab */}
        {activeTab === "resources" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Filters */}
            <div className="glass-panel" style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Language Filter:</span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {[
                  { id: "all", name: "All Languages" },
                  { id: "english", name: "English 🇬🇧" },
                  { id: "urdu", name: "Urdu 🇵🇰" },
                  { id: "hindi", name: "Hindi 🇮🇳" }
                ].map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => setVideoLang(lang.id)}
                    className="btn btn-secondary"
                    style={{
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.8rem",
                      background: videoLang === lang.id ? "rgba(139, 92, 246, 0.15)" : "rgba(255,255,255,0.02)",
                      borderColor: videoLang === lang.id ? "var(--accent-purple)" : "var(--border-muted)"
                    }}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Cards Grid */}
            {filteredVideos.length === 0 ? (
              <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem" }}>
                No YouTube resources seeded in this language filter. Check other languages!
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
                {filteredVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    isBookmarked={bookmarks.includes(video.id)}
                    onBookmarkToggle={handleBookmarkToggle}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Practice Tab */}
        {activeTab === "practice" && (
          <div>
            {skill.practice_tasks.length === 0 ? (
              <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem" }}>
                No coding challenges are seeded for this course. Browse the main Practice Panel!
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
                {skill.practice_tasks.map((task) => (
                  <PracticeCard key={task.id} challenge={task} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Concepts Tab */}
        {activeTab === "concepts" && (
          <div className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Core Concept Reference</h3>
            
            {concepts.length === 0 ? (
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", padding: "1rem" }}>
                No specific conceptual notes added. Check the introduction roadmap tab.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {concepts.map((concept, idx) => (
                  <div key={idx} style={{
                    padding: "1.25rem",
                    borderLeft: "3px solid var(--accent-cyan)",
                    background: "rgba(6, 182, 212, 0.01)",
                    borderRadius: "0 var(--border-radius-sm) var(--border-radius-sm) 0"
                  }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--accent-cyan)" }}>
                      {concept.name}
                    </h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.4rem", lineHeight: 1.5 }}>
                      {concept.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default SkillDetail;
