import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Code2, Search, Filter, ShieldAlert } from "lucide-react";
import PracticeCard from "../components/PracticeCard";

const Practice = () => {
  const { authFetch } = useAuth();
  
  // Data lists
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [selectedSkillId, setSelectedSkillId] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const challengesPerPage = 6;

  useEffect(() => {
    const loadPracticeData = async () => {
      try {
        setLoading(true);
        const [pracData, skillsData] = await Promise.all([
          authFetch("/api/practice"),
          authFetch("/api/skills")
        ]);
        setChallenges(pracData);
        setFilteredChallenges(pracData);
        setSkills(skillsData);
      } catch (err) {
        console.error("Error loading practice content:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPracticeData();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = challenges;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.topic.toLowerCase().includes(q)
      );
    }

    if (difficulty !== "all") {
      result = result.filter(c => c.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    if (platform !== "all") {
      result = result.filter(c => c.platform.toLowerCase() === platform.toLowerCase());
    }

    if (selectedSkillId !== "all") {
      result = result.filter(c => c.skill_id === parseInt(selectedSkillId));
    }

    setFilteredChallenges(result);
    setCurrentPage(1); // Reset page on filter update
  }, [searchQuery, difficulty, platform, selectedSkillId, challenges]);

  // Page calculations
  const totalPages = Math.ceil(filteredChallenges.length / challengesPerPage);
  const indexOfLastChallenge = currentPage * challengesPerPage;
  const indexOfFirstChallenge = indexOfLastChallenge - challengesPerPage;
  const currentChallenges = filteredChallenges.slice(indexOfFirstChallenge, indexOfLastChallenge);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Page Title Header */}
      <div>
        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>Coding Arena</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Sharpen your coding skills with curated challenges across LeetCode, HackerRank, and W3Schools.
        </p>
      </div>

      {/* Interactive Filters Area */}
      <section className="glass-panel" style={{ padding: "1.5rem 2rem", display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "center" }}>
        
        {/* Search */}
        <div style={{ flex: 2, minWidth: "250px", position: "relative" }}>
          <Search size={16} color="var(--text-dark)" style={{ position: "absolute", left: "1rem", top: "1.05rem" }} />
          <input
            type="text"
            placeholder="Search problems by name or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "2.75rem", height: "38px", fontSize: "0.85rem" }}
          />
        </div>

        {/* Skill Category Filter */}
        <div style={{ flex: 1, minWidth: "150px" }}>
          <select 
            value={selectedSkillId} 
            onChange={(e) => setSelectedSkillId(e.target.value)}
            style={{ height: "38px", fontSize: "0.85rem" }}
          >
            <option value="all">All Skills</option>
            {skills.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Platform Filter */}
        <div style={{ flex: 1, minWidth: "150px" }}>
          <select 
            value={platform} 
            onChange={(e) => setPlatform(e.target.value)}
            style={{ height: "38px", fontSize: "0.85rem" }}
          >
            <option value="all">All Platforms</option>
            <option value="leetcode">LeetCode</option>
            <option value="hackerrank">HackerRank</option>
            <option value="w3schools">W3Schools</option>
          </select>
        </div>

        {/* Difficulty buttons */}
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
          {[
            { id: "all", name: "All Levels" },
            { id: "easy", name: "Easy" },
            { id: "medium", name: "Medium" },
            { id: "hard", name: "Hard" }
          ].map(lvl => (
            <button
              key={lvl.id}
              onClick={() => setDifficulty(lvl.id)}
              className="btn btn-secondary"
              style={{
                padding: "0.45rem 0.85rem",
                fontSize: "0.8rem",
                borderRadius: "var(--border-radius-sm)",
                background: difficulty === lvl.id ? "rgba(6, 182, 212, 0.15)" : "rgba(255,255,255,0.02)",
                borderColor: difficulty === lvl.id ? "var(--accent-cyan)" : "var(--border-muted)",
                color: difficulty === lvl.id ? "white" : "var(--text-muted)"
              }}
            >
              {lvl.name}
            </button>
          ))}
        </div>

      </section>

      {/* Challenges Grid */}
      {loading ? (
        <div style={{ textAlign: "center", color: "var(--accent-cyan)", padding: "4rem" }} className="pulse-glow">
          Loading challenge database...
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
          <ShieldAlert size={40} style={{ marginBottom: "1rem", color: "var(--text-dark)" }} />
          <h3>No matching practice challenges found.</h3>
          <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>Try loosening your filters or search terms.</p>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {currentChallenges.map((challenge) => (
              <PracticeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "2.5rem",
              padding: "0.5rem"
            }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="btn btn-secondary"
                style={{
                  padding: "0.4rem 0.8rem",
                  fontSize: "0.8rem",
                  opacity: currentPage === 1 ? 0.4 : 1,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer"
                }}
              >
                &lt; Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className="btn btn-secondary"
                  style={{
                    padding: "0.4rem 0.8rem",
                    fontSize: "0.8rem",
                    background: currentPage === pageNum ? "rgba(139, 92, 246, 0.18)" : "rgba(255,255,255,0.02)",
                    borderColor: currentPage === pageNum ? "var(--accent-purple)" : "var(--border-muted)",
                    color: currentPage === pageNum ? "white" : "var(--text-muted)"
                  }}
                >
                  {pageNum}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="btn btn-secondary"
                style={{
                  padding: "0.4rem 0.8rem",
                  fontSize: "0.8rem",
                  opacity: currentPage === totalPages ? 0.4 : 1,
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer"
                }}
              >
                Next &gt;
              </button>
            </div>
          )}
        </>
      )}


    </div>
  );
};

export default Practice;
