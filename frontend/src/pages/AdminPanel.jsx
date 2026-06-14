import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Settings, Plus, Users, Video, Code, Shield, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";

const AdminPanel = () => {
  const { authFetch } = useAuth();
  
  // Lists
  const [skills, setSkills] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // Tabs: "skills" | "videos" | "practice" | "users"
  const [activeTab, setActiveTab] = useState("skills");

  // Form States - Add Skill
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState("Programming Languages");
  const [skillDesc, setSkillDesc] = useState("");
  const [skillRoadmapTemplate, setSkillRoadmapTemplate] = useState(
    JSON.stringify({
      introduction: "Learn the fundamentals and advanced details of this skill.",
      beginner: [
        { title: "Variables & Types", description: "Standard variable scoping and syntax." },
        { title: "Loops & Conditions", description: "Writing conditionals and iterations." }
      ],
      intermediate: [
        { title: "Data Structs", description: "List patterns and data organization." },
        { title: "OOP", description: "Classes, abstraction, and structures." }
      ],
      advanced: [
        { title: "Concurrency", description: "Multi-threaded execution." }
      ],
      concepts: [
        { name: "First Principle", value: "Focus on active execution." }
      ]
    }, null, 2)
  );

  // Form States - Add Resource (Video)
  const [resSkillId, setResSkillId] = useState("");
  const [resTitle, setResTitle] = useState("");
  const [resLang, setResLang] = useState("English");
  const [resUrl, setResUrl] = useState("");
  const [resChannel, setResChannel] = useState("");
  const [resDifficulty, setResDifficulty] = useState("Beginner");

  // Form States - Add Practice Challenge
  const [pracSkillId, setPracSkillId] = useState("");
  const [pracTitle, setPracTitle] = useState("");
  const [pracDifficulty, setPracDifficulty] = useState("Easy");
  const [pracUrl, setPracUrl] = useState("");
  const [pracPlatform, setPracPlatform] = useState("LeetCode");
  const [pracTopic, setPracTopic] = useState("General");

  // Load lists
  const loadAdminData = async () => {
    try {
      const skillsData = await authFetch("/api/skills");
      setSkills(skillsData);
      
      const usersData = await authFetch("/api/admin/users");
      setUsers(usersData);

      if (skillsData.length > 0) {
        setResSkillId(skillsData[0].id.toString());
        setPracSkillId(skillsData[0].id.toString());
      }
    } catch (err) {
      console.error("Failed to load admin lists:", err);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);
    try {
      // Validate JSON
      JSON.parse(skillRoadmapTemplate);
      
      await authFetch("/api/admin/skills", {
        method: "POST",
        body: JSON.stringify({
          name: skillName,
          category: skillCategory,
          description: skillDesc,
          roadmap_json: skillRoadmapTemplate
        })
      });

      setMsg("New skill added successfully!");
      setSkillName("");
      setSkillDesc("");
      loadAdminData();
    } catch (err) {
      setError(err.message || "Failed to create skill. Check JSON syntax.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);
    try {
      await authFetch("/api/admin/resources", {
        method: "POST",
        body: JSON.stringify({
          skill_id: parseInt(resSkillId),
          title: resTitle,
          platform: "YouTube",
          type: "Video",
          language: resLang,
          url: resUrl,
          channel_name: resChannel,
          difficulty: resDifficulty
        })
      });

      setMsg("YouTube video resource linked successfully!");
      setResTitle("");
      setResUrl("");
      setResChannel("");
      loadAdminData();
    } catch (err) {
      setError(err.message || "Failed to link resource");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPractice = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);
    try {
      await authFetch("/api/admin/practice", {
        method: "POST",
        body: JSON.stringify({
          skill_id: parseInt(pracSkillId),
          title: pracTitle,
          difficulty: pracDifficulty,
          url: pracUrl,
          platform: pracPlatform,
          topic: pracTopic
        })
      });

      setMsg("Coding practice challenge appended successfully!");
      setPracTitle("");
      setPracUrl("");
      setPracTopic("");
      loadAdminData();
    } catch (err) {
      setError(err.message || "Failed to append challenge");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserRole = async (userId, currentRole) => {
    setMsg("");
    setError("");
    const targetRole = currentRole === "admin" ? "student" : "admin";
    try {
      await authFetch(`/api/admin/users/${userId}/role?role=${targetRole}`, {
        method: "PUT"
      });
      setMsg("User role updated successfully!");
      loadAdminData();
    } catch (err) {
      setError(err.message || "Failed to alter user clearance role");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Title Header */}
      <div>
        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>Admin Console</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Incorporate new skill roadmaps, seed video tutorials, list challenges, and adjust user credentials.
        </p>
      </div>

      {msg && (
        <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "#34d399", padding: "0.75rem", borderRadius: "4px", fontSize: "0.85rem" }}>
          <CheckCircle size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "0.5rem" }} />
          <span>{msg}</span>
        </div>
      )}
      {error && (
        <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#f87171", padding: "0.75rem", borderRadius: "4px", fontSize: "0.85rem" }}>
          <AlertTriangle size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "0.5rem" }} />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid var(--border-muted)", paddingBottom: "0.5rem" }}>
        {[
          { id: "skills", name: "Create Skill Roadmap", icon: Plus },
          { id: "videos", name: "Inject YouTube Link", icon: Video },
          { id: "practice", name: "Add Practice Task", icon: Code },
          { id: "users", name: "User Credentials", icon: Users }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                setMsg("");
                setError("");
              }}
              style={{
                background: "transparent",
                color: isActive ? "white" : "var(--text-muted)",
                border: "none",
                padding: "0.75rem 1rem",
                fontSize: "0.9rem",
                fontWeight: isActive ? 700 : 500,
                borderBottom: isActive ? "2px solid var(--accent-purple)" : "2px solid transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <Icon size={16} />
              <span>{t.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="glass-panel" style={{ padding: "2rem" }}>
        
        {/* CREATE SKILL */}
        {activeTab === "skills" && (
          <form onSubmit={handleAddSkill} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Add a New Technical Skill</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>Skill Name</label>
                <input type="text" placeholder="e.g. Kotlin, Docker" value={skillName} onChange={(e) => setSkillName(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>Category</label>
                <select value={skillCategory} onChange={(e) => setSkillCategory(e.target.value)}>
                  <option value="Programming Languages">Programming Languages</option>
                  <option value="Web Development">Web Development</option>
                  <option value="AI & Data">AI & Data</option>
                  <option value="Other Skills">Other Skills</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>Short Description</label>
              <textarea placeholder="Write a summary description of this syllabus..." value={skillDesc} onChange={(e) => setSkillDesc(e.target.value)} rows={2} required />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>Roadmap JSON Configuration</label>
              <textarea
                value={skillRoadmapTemplate}
                onChange={(e) => setSkillRoadmapTemplate(e.target.value)}
                rows={10}
                style={{ fontFamily: "monospace", fontSize: "0.8rem" }}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "fit-content", padding: "0.75rem 2.5rem" }}>
              {loading ? "Creating..." : "Publish Skill"}
            </button>
          </form>
        )}

        {/* INJECT YOUTUBE LINK */}
        {activeTab === "videos" && (
          <form onSubmit={handleAddResource} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Add YouTube Learning Material</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>Associated Skill</label>
                <select value={resSkillId} onChange={(e) => setResSkillId(e.target.value)}>
                  {skills.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>Video Title</label>
                <input type="text" placeholder="e.g. Master React in 100 Seconds" value={resTitle} onChange={(e) => setResTitle(e.target.value)} required />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>Language</label>
                <select value={resLang} onChange={(e) => setResLang(e.target.value)}>
                  <option value="English">English</option>
                  <option value="Urdu">Urdu</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>Channel Name</label>
                <input type="text" placeholder="e.g. Mosh Hamedani" value={resChannel} onChange={(e) => setResChannel(e.target.value)} required />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>Difficulty</label>
                <select value={resDifficulty} onChange={(e) => setResDifficulty(e.target.value)}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>YouTube Video URL</label>
              <input type="url" placeholder="https://www.youtube.com/watch?v=..." value={resUrl} onChange={(e) => setResUrl(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "fit-content", padding: "0.75rem 2.5rem" }}>
              {loading ? "Linking..." : "Link Video"}
            </button>
          </form>
        )}

        {/* ADD PRACTICE TASK */}
        {activeTab === "practice" && (
          <form onSubmit={handleAddPractice} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Add Coding Challenge</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>Associated Skill</label>
                <select value={pracSkillId} onChange={(e) => setPracSkillId(e.target.value)}>
                  {skills.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>Challenge Title</label>
                <input type="text" placeholder="e.g. Reverse Linked List" value={pracTitle} onChange={(e) => setPracTitle(e.target.value)} required />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>External Platform</label>
                <select value={pracPlatform} onChange={(e) => setPracPlatform(e.target.value)}>
                  <option value="LeetCode">LeetCode</option>
                  <option value="HackerRank">HackerRank</option>
                  <option value="W3Schools">W3Schools</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>Difficulty</label>
                <select value={pracDifficulty} onChange={(e) => setPracDifficulty(e.target.value)}>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>Topic Tag</label>
                <input type="text" placeholder="e.g. Recursion, Arrays" value={pracTopic} onChange={(e) => setPracTopic(e.target.value)} required />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>Challenge URL</label>
              <input type="url" placeholder="https://leetcode.com/problems/..." value={pracUrl} onChange={(e) => setPracUrl(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "fit-content", padding: "0.75rem 2.5rem" }}>
              {loading ? "Adding..." : "Add Challenge"}
            </button>
          </form>
        )}

        {/* USER SECURITY SETTINGS */}
        {activeTab === "users" && (
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>User Management</h3>
            
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-muted)" }}>
                    <th style={{ padding: "0.75rem", color: "var(--text-dark)" }}>Name</th>
                    <th style={{ padding: "0.75rem", color: "var(--text-dark)" }}>Email</th>
                    <th style={{ padding: "0.75rem", color: "var(--text-dark)" }}>Authorization</th>
                    <th style={{ padding: "0.75rem", color: "var(--text-dark)" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: "1px solid var(--border-muted)" }}>
                      <td style={{ padding: "0.75rem", fontWeight: 600 }}>{u.name}</td>
                      <td style={{ padding: "0.75rem", color: "var(--text-muted)" }}>{u.email}</td>
                      <td style={{ padding: "0.75rem" }}>
                        <span style={{
                          color: u.role === "admin" ? "var(--accent-pink)" : "var(--accent-cyan)",
                          fontWeight: 700,
                          textTransform: "uppercase"
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        <button
                          onClick={() => handleToggleUserRole(u.id, u.role)}
                          className="btn btn-secondary"
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                        >
                          <Shield size={12} style={{ marginRight: "2px" }} />
                          <span>Toggle Role</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPanel;
