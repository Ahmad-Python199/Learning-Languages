import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Trophy, 
  Flame, 
  BookOpen, 
  Bookmark, 
  CheckCircle, 
  Compass, 
  Calendar, 
  Plus, 
  Check, 
  Sparkles, 
  TrendingUp, 
  ArrowRight,
  Trash2
} from "lucide-react";

const Dashboard = () => {
  const { authFetch, user, updateProfile } = useAuth();
  
  // Dashboard states
  const [skills, setSkills] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [recommendations, setRecommendations] = useState("");
  const [recLoading, setRecLoading] = useState(false);
  const [activities, setActivities] = useState([]);

  // Goal states
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");

  // Load dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [skillsData, progressData, bookmarksData, chatHistory] = await Promise.all([
          authFetch("/api/skills"),
          authFetch("/api/progress"),
          authFetch("/api/resources/bookmarks"),
          authFetch("/api/chat/history")
        ]);

        setSkills(skillsData);
        setProgressRecords(progressData);
        setBookmarks(bookmarksData);
        
        // Parse user goals
        if (user && user.goals_json) {
          try {
            setGoals(json.parse(user.goals_json));
          } catch (e) {
            setGoals(JSON.parse(user.goals_json || "[]"));
          }
        }

        // Generate activity logs from chat history and progress
        const logs = [];
        progressData.forEach(p => {
          const matchedSkill = skillsData.find(s => s.id === p.skill_id);
          if (matchedSkill) {
            logs.push({
              title: `Updated progress in ${matchedSkill.name}`,
              desc: `Completed nodes percentage reached ${p.completion_percentage}%`,
              time: "Recently"
            });
          }
        });
        chatHistory.slice(0, 3).forEach(c => {
          logs.push({
            title: "Consulted AI Assistant",
            desc: `Asked: "${c.message.slice(0, 40)}..."`,
            time: new Date(c.created_at).toLocaleDateString()
          });
        });
        setActivities(logs);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, [user?.goals_json]);

  // Load recommendations
  const loadRecommendations = async () => {
    setRecLoading(true);
    try {
      const data = await authFetch("/api/chat/recommendations");
      setRecommendations(data.recommendation);
    } catch (err) {
      console.error("Error loading recommendations:", err);
      setRecommendations("Connect your OpenRouter API Key to receive live AI recommendations based on your progress.");
    } finally {
      setRecLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, []);

  // Goal Handlers
  const handleAddGoal = async () => {
    if (!newGoal.trim()) return;
    const updatedGoals = [...goals, { text: newGoal, done: false }];
    setGoals(updatedGoals);
    setNewGoal("");
    await updateProfile({ goals_json: JSON.stringify(updatedGoals) });
  };

  const handleToggleGoal = async (index) => {
    const updatedGoals = goals.map((g, i) => i === index ? { ...g, done: !g.done } : g);
    setGoals(updatedGoals);
    await updateProfile({ goals_json: JSON.stringify(updatedGoals) });
  };

  const handleDeleteGoal = async (index) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    setGoals(updatedGoals);
    await updateProfile({ goals_json: JSON.stringify(updatedGoals) });
  };

  // Resolve skill maps
  const getActiveSkills = () => {
    return progressRecords
      .filter(p => p.completion_percentage > 0 && p.completion_percentage < 100)
      .map(p => {
        const skill = skills.find(s => s.id === p.skill_id);
        return skill ? { ...skill, percentage: p.completion_percentage } : null;
      })
      .filter(Boolean);
  };

  const getCompletedSkills = () => {
    return progressRecords
      .filter(p => p.completion_percentage >= 100)
      .map(p => {
        const skill = skills.find(s => s.id === p.skill_id);
        return skill ? { ...skill, percentage: 100 } : null;
      })
      .filter(Boolean);
  };

  const getRecommendedSkillsList = () => {
    // Recommend skills the user hasn't started yet
    const startedIds = progressRecords.map(p => p.skill_id);
    return skills.filter(s => !startedIds.includes(s.id)).slice(0, 3);
  };

  const userBadges = JSON.parse(user?.badges_json || "[]");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Welcome Banner */}
      <section className="glass-panel" style={{
        padding: "2.5rem",
        background: "linear-gradient(135deg, rgba(13, 13, 29, 0.6) 0%, rgba(139, 92, 246, 0.05) 100%)",
        border: "1px solid rgba(139, 92, 246, 0.2)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Welcome back, <span style={{
              background: "linear-gradient(to right, var(--accent-cyan), var(--accent-purple))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>{user?.name}</span>!
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            You are maintaining a <strong>{user?.streak_count || 0}-day learning streak</strong>. Keep pushing your limits!
          </p>
        </div>
        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(139, 92, 246, 0.1)",
          border: "1px dashed rgba(139, 92, 246, 0.3)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Trophy size={40} color="var(--accent-purple)" className="pulse-glow" />
        </div>
      </section>

      {/* Analytics Counter Grid */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ padding: "0.75rem", borderRadius: "12px", background: "rgba(236, 72, 153, 0.1)", color: "var(--accent-pink)" }}>
            <Flame size={24} />
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{user?.streak_count || 0}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-dark)", fontWeight: 600, uppercase: "true" }}>Streak Count</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ padding: "0.75rem", borderRadius: "12px", background: "rgba(6, 182, 212, 0.1)", color: "var(--accent-cyan)" }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{progressRecords.length}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-dark)", fontWeight: 600, uppercase: "true" }}>Active Skills</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ padding: "0.75rem", borderRadius: "12px", background: "rgba(16, 185, 129, 0.1)", color: "var(--accent-green)" }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{getCompletedSkills().length}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-dark)", fontWeight: 600, uppercase: "true" }}>Skills Mastered</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ padding: "0.75rem", borderRadius: "12px", background: "rgba(139, 92, 246, 0.1)", color: "var(--accent-purple)" }}>
            <Trophy size={24} />
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{userBadges.length}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-dark)", fontWeight: 600, uppercase: "true" }}>Badges Earned</div>
          </div>
        </div>
      </section>

      {/* Main Multi-grid Panels */}
      <div className="dashboard-grid">
        {/* Left Side (Courses & AI recommendations) */}
        <div style={{ gridColumn: "span 8", display: "flex", flexDirection: "column", gap: "2rem" }} className="dash-col-left">
          
          {/* Active Courses */}
          <div className="glass-panel" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <TrendingUp size={20} color="var(--accent-cyan)" />
              <span>In-Progress Skills</span>
            </h3>
            
            {getActiveSkills().length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                You have not started any roadmaps yet. Browse the{" "}
                <Link to="/skills" style={{ color: "var(--accent-cyan)", textDecoration: "none", fontWeight: 600 }}>
                  Skill Hub
                </Link>{" "}
                to initiate your first course!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {getActiveSkills().map((skill) => (
                  <div key={skill.id} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "rgba(255,255,255,0.02)",
                    padding: "1rem 1.5rem",
                    borderRadius: "var(--border-radius-sm)",
                    border: "1px solid var(--border-muted)"
                  }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: "1rem", fontWeight: 700 }}>{skill.name}</h4>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-dark)" }}>{skill.category}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flex: 1, justifyContent: "flex-end" }}>
                      <div style={{ width: "150px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                          <span>Completion</span>
                          <span>{skill.percentage}%</span>
                        </div>
                        <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{ width: `${skill.percentage}%`, height: "100%", background: "linear-gradient(90deg, var(--accent-purple), var(--accent-cyan))" }} />
                        </div>
                      </div>

                      <Link to={`/skills/${skill.id}`} className="btn btn-secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}>
                        <span>Continue</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Recommended skills panel */}
          <div className="glass-panel" style={{ padding: "2rem", border: "1px solid rgba(6, 182, 212, 0.2)" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Sparkles size={20} color="var(--accent-cyan)" />
              <span>AI recommendations</span>
            </h3>

            {recLoading ? (
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", padding: "1rem" }} className="pulse-glow">
                Analyzing progress models and formulating career suggestions...
              </div>
            ) : (
              <div style={{
                background: "rgba(6, 182, 212, 0.03)",
                border: "1px solid rgba(6, 182, 212, 0.1)",
                padding: "1.25rem",
                borderRadius: "var(--border-radius-sm)",
                fontSize: "0.9rem",
                lineHeight: "1.6",
                color: "var(--text-muted)",
                whiteSpace: "pre-line"
              }}>
                {recommendations || "No recommendations generated yet. Complete actions to generate recommendations."}
              </div>
            )}

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              {getRecommendedSkillsList().map(s => (
                <Link
                  key={s.id}
                  to={`/skills/${s.id}`}
                  style={{
                    flex: 1,
                    textDecoration: "none",
                    padding: "1rem",
                    borderRadius: "var(--border-radius-sm)",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border-muted)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                    transition: "var(--transition-smooth)"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent-purple)"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-muted)"}
                >
                  <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "white" }}>{s.name}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-dark)" }}>{s.category}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side (Goals, Bookmarks, Activities) */}
        <div style={{ gridColumn: "span 4", display: "flex", flexDirection: "column", gap: "2rem" }} className="dash-col-right">
          
          {/* Daily Goals */}
          <div className="glass-panel" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Calendar size={18} color="var(--accent-pink)" />
              <span>Daily Target Goals</span>
            </h3>

            {/* Input */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <input
                type="text"
                placeholder="Learn variables, solve arrays..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddGoal()}
                style={{ height: "36px", fontSize: "0.85rem" }}
              />
              <button onClick={handleAddGoal} className="btn btn-primary" style={{ padding: "0.5rem 0.75rem", borderRadius: "var(--border-radius-sm)" }}>
                <Plus size={16} />
              </button>
            </div>

            {/* Goals List */}
            {goals.length === 0 ? (
              <div style={{ fontSize: "0.8rem", color: "var(--text-dark)", textAlign: "center", padding: "1rem" }}>
                No goals added for today. Add targets to track your milestones!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {goals.map((g, idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "6px",
                    background: g.done ? "rgba(16, 185, 129, 0.05)" : "rgba(255,255,255,0.01)",
                    border: g.done ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid var(--border-muted)"
                  }}>
                    <div 
                      onClick={() => handleToggleGoal(idx)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        cursor: "pointer",
                        textDecoration: g.done ? "line-through" : "none",
                        color: g.done ? "var(--text-dark)" : "var(--text-main)",
                        fontSize: "0.85rem",
                        flex: 1
                      }}
                    >
                      <div style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "4px",
                        border: "1px solid var(--text-dark)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: g.done ? "var(--accent-green)" : "transparent"
                      }}>
                        {g.done && <Check size={12} color="black" strokeWidth={3} />}
                      </div>
                      <span>{g.text}</span>
                    </div>

                    <button 
                      onClick={() => handleDeleteGoal(idx)}
                      style={{ background: "transparent", color: "var(--text-dark)", cursor: "pointer", border: "none" }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#f87171"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-dark)"}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Bookmarks shortcut */}
          <div className="glass-panel" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Bookmark size={18} color="var(--accent-purple)" />
              <span>Saved Resources</span>
            </h3>

            {bookmarks.length === 0 ? (
              <div style={{ fontSize: "0.8rem", color: "var(--text-dark)", textAlign: "center", padding: "1rem" }}>
                No resources bookmarked yet. Toggle the bookmark icon on tutorial video cards to save them.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {bookmarks.slice(0, 4).map((b) => (
                  <a
                    key={b.id}
                    href={b.resource?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.15rem",
                      padding: "0.6rem 0.85rem",
                      borderRadius: "6px",
                      background: "rgba(255,255,255,0.01)",
                      border: "1px solid var(--border-muted)",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "var(--transition-smooth)"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent-cyan)"}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-muted)"}
                  >
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                      {b.resource?.title}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-dark)" }}>
                      {b.resource?.platform} • {b.resource?.language}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="glass-panel" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Compass size={18} color="var(--accent-purple)" />
              <span>Recent Activity</span>
            </h3>

            {activities.length === 0 ? (
              <div style={{ fontSize: "0.8rem", color: "var(--text-dark)", textAlign: "center", padding: "1rem" }}>
                No recent activity records found. Continue learning to build history!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {activities.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", borderLeft: "2px solid var(--border-muted)", paddingLeft: "0.75rem" }}>
                    <div>
                      <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "white" }}>{a.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>{a.desc}</div>
                      <div style={{ fontSize: "0.65rem", color: "var(--text-dark)", marginTop: "0.25rem" }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Media styling for layout */}
      <style>{`
        @media (max-width: 1024px) {
          .dashboard-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
