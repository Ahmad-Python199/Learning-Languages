import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield, Award, Calendar, Bookmark, Lock, Trash2, CheckCircle, FileText, Download } from "lucide-react";
import Modal from "../components/Modal";

const Profile = () => {
  const { user, updateProfile, authFetch } = useAuth();
  
  // Update fields states
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // Bookmark states
  const [bookmarks, setBookmarks] = useState([]);

  // Certificate modal states
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [activeCert, setActiveCert] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Load bookmarks
  const fetchBookmarks = async () => {
    try {
      const data = await authFetch("/api/resources/bookmarks");
      setBookmarks(data);
    } catch (err) {
      console.error("Error loading bookmarks:", err);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);
    try {
      const payload = { name, email };
      if (password) payload.password = password;
      await updateProfile(payload);
      setMsg("Profile updated successfully!");
      setPassword("");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (resId) => {
    try {
      await authFetch(`/api/resources/${resId}/bookmark`, { method: "DELETE" });
      setBookmarks(bookmarks.filter(b => b.resource_id !== resId));
    } catch (err) {
      console.error("Failed to remove bookmark:", err);
    }
  };

  // Extract badges
  const badges = JSON.parse(user?.badges_json || "[]");

  // Generate certificates from 100% completed skills
  const [completedSkills, setCompletedSkills] = useState([]);
  
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progressData = await authFetch("/api/progress");
        const skillsData = await authFetch("/api/skills");
        const completed = progressData
          .filter(p => p.completion_percentage >= 100)
          .map(p => {
            const skill = skillsData.find(s => s.id === p.skill_id);
            return skill ? { name: skill.name, date: new Date().toLocaleDateString() } : null;
          })
          .filter(Boolean);
        setCompletedSkills(completed);
      } catch (err) {
        console.error("Error calculating certificates:", err);
      }
    };
    fetchProgress();
  }, []);

  const triggerCertView = (cert) => {
    setActiveCert(cert);
    setCertModalOpen(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Upper Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }} className="profile-grid">
        
        {/* Profile Settings Card */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <User size={18} color="var(--accent-cyan)" />
            <span>Profile Settings</span>
          </h3>

          {msg && (
            <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "#34d399", padding: "0.75rem", borderRadius: "4px", fontSize: "0.85rem", marginBottom: "1rem" }}>
              {msg}
            </div>
          )}
          {error && (
            <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#f87171", padding: "0.75rem", borderRadius: "4px", fontSize: "0.85rem", marginBottom: "1rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>Full Name</label>
              <div style={{ position: "relative" }}>
                <User size={16} color="var(--text-dark)" style={{ position: "absolute", left: "1rem", top: "1.1rem" }} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ paddingLeft: "2.75rem" }} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} color="var(--text-dark)" style={{ position: "absolute", left: "1rem", top: "1.1rem" }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ paddingLeft: "2.75rem" }} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>New Password (Leave blank to keep same)</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="var(--text-dark)" style={{ position: "absolute", left: "1rem", top: "1.1rem" }} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ paddingLeft: "2.75rem" }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "fit-content", padding: "0.75rem 2rem", alignSelf: "flex-start" }}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Credentials and Streak summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(139, 92, 246, 0.1)", display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid rgba(139, 92, 246, 0.3)" }}>
              <Shield size={28} color="var(--accent-purple)" />
            </div>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>System Authorization</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>Role: <span style={{ color: "var(--accent-cyan)", fontWeight: 700, textTransform: "uppercase" }}>{user?.role}</span></div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dark)", marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Calendar size={12} />
                Joined: {user ? new Date(user.created_at).toLocaleDateString() : "Loading"}
              </div>
            </div>
          </div>

          {/* Achievement Badges Box */}
          <div className="glass-panel" style={{ padding: "2rem", flex: 1 }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Award size={18} color="var(--accent-pink)" />
              <span>Earned Badges ({badges.length})</span>
            </h3>

            {badges.length === 0 ? (
              <p style={{ fontSize: "0.8rem", color: "var(--text-dark)", textAlign: "center", padding: "1rem" }}>No badges earned yet. Study skills and maintain streaks to earn badges.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "1rem" }}>
                {badges.map((b, i) => (
                  <div key={i} className="glass-panel" style={{
                    padding: "0.85rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.4rem",
                    textAlign: "center",
                    background: "rgba(139, 92, 246, 0.03)",
                    border: "1px solid rgba(139, 92, 246, 0.15)",
                    boxShadow: "0 0 10px rgba(139, 92, 246, 0.05)"
                  }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, var(--accent-purple), var(--accent-pink))", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold", fontSize: "0.9rem", color: "white" }}>
                      🏅
                    </div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-main)" }}>{b}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Certificates Section */}
      <section className="glass-panel" style={{ padding: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FileText size={18} color="var(--accent-purple)" />
          <span>Mastery Certificates</span>
        </h3>

        {completedSkills.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Certificates will be unlocked here once you complete 100% of any skill roadmap.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {completedSkills.map((cert, idx) => (
              <div key={idx} className="glass-panel" style={{
                padding: "1.25rem",
                background: "linear-gradient(135deg, rgba(13, 13, 29, 0.5) 0%, rgba(6, 182, 212, 0.05) 100%)",
                border: "1px solid rgba(6, 182, 212, 0.2)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "white" }}>{cert.name} Mastery</h4>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-dark)", marginTop: "0.15rem" }}>Issued: {cert.date}</p>
                </div>
                <button onClick={() => triggerCertView(cert)} className="btn btn-primary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}>
                  <span>View Credentials</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bookmarks Section */}
      <section className="glass-panel" style={{ padding: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Bookmark size={18} color="var(--accent-cyan)" />
          <span>My Bookmarked Learning Materials ({bookmarks.length})</span>
        </h3>

        {bookmarks.length === 0 ? (
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "center", padding: "1.5rem" }}>
            You haven't bookmarked any tutorials yet. Head to a skill page to bookmark some videos!
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {bookmarks.map((b) => (
              <div key={b.id} className="glass-panel" style={{
                padding: "1rem 1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(255,255,255,0.01)"
              }}>
                <div style={{ overflow: "hidden", marginRight: "1rem" }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {b.resource?.title}
                  </h4>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-dark)", marginTop: "0.15rem" }}>
                    {b.resource?.platform} • {b.resource?.language} • {b.resource?.difficulty}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                  <a href={b.resource?.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}>
                    Open
                  </a>
                  <button onClick={() => handleRemoveBookmark(b.resource_id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-dark)" }} onMouseEnter={(e) => e.currentTarget.style.color = "#f87171"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-dark)"}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Dynamic Certificate Mockup Modal */}
      {certModalOpen && activeCert && (
        <Modal isOpen={certModalOpen} onClose={() => setCertModalOpen(false)} title="Certificate Credentials">
          <div style={{
            background: "linear-gradient(135deg, #090915 0%, #1e1b4b 100%)",
            border: "2px solid rgba(6, 182, 212, 0.4)",
            borderRadius: "var(--border-radius-md)",
            padding: "2rem",
            color: "white",
            textAlign: "center",
            position: "relative",
            overflow: "hidden"
          }} id="skillsphere-certificate">
            {/* Holographic glowing lines background inside certificate */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "linear-gradient(to right, var(--accent-purple), var(--accent-cyan))" }} />
            
            <div style={{ display: "flex", justifyContent: "center", gap: "0.25rem", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--accent-cyan)" }} />
              <span style={{ fontSize: "0.9rem", fontWeight: 800, letterSpacing: "1px", color: "var(--accent-cyan)" }}>SKILLSPHERE</span>
            </div>

            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "white", marginTop: "1rem", letterSpacing: "0.5px" }}>CERTIFICATE OF COMPLETION</h2>
            <p style={{ fontSize: "0.75rem", color: "var(--text-dark)", letterSpacing: "2px", marginTop: "0.5rem" }}>THIS IS PROUDLY PRESENTED TO</p>
            
            <h3 style={{ fontSize: "1.8rem", fontFamily: "Outfit", fontWeight: 800, margin: "1.5rem 0", color: "var(--accent-purple)", textShadow: "0 0 15px rgba(139, 92, 246, 0.4)" }}>
              {user?.name}
            </h3>

            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "380px", margin: "0 auto", lineHeight: "1.5" }}>
              for successfully finishing the interactive roadmap and demonstrating 100% complete proficiency in the skill sector
            </p>

            <h4 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--accent-cyan)", margin: "1.25rem 0" }}>
              {activeCert.name}
            </h4>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.5rem", marginTop: "1.5rem", display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-dark)" }}>
              <div>
                <div>Issued on: {activeCert.date}</div>
                <div>ID: SSP-{Math.floor(Math.random() * 900000) + 100000}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "var(--accent-purple)", fontWeight: "bold" }}>SkillSphere verified</div>
                <div>AI Learning Platform</div>
              </div>
            </div>
          </div>
          
          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            <button onClick={() => window.print()} className="btn btn-accent" style={{ flex: 1, justifyContent: "center" }}>
              <Download size={16} />
              <span>Print Certificate</span>
            </button>
            <button onClick={() => setCertModalOpen(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: "center" }}>
              Close
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default Profile;
