import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Code, 
  HelpCircle, 
  Clock, 
  Bug, 
  ArrowRight,
  FileCode,
  Terminal
} from "lucide-react";

const ChatAssistant = () => {
  const { authFetch, user } = useAuth();
  const [searchParams] = useSearchParams();

  // Chat configurations
  const [chatMode, setChatMode] = useState("tutor"); // "tutor" or "code"
  const [history, setHistory] = useState([]);
  const [activeChat, setActiveChat] = useState([]); // active conversation messages
  const [loading, setLoading] = useState(false);

  // Input states
  const [message, setMessage] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [codeLang, setCodeLang] = useState("python");
  const [codeQueryType, setCodeQueryType] = useState("debug"); // "debug", "explain", "refactor"

  const chatEndRef = useRef(null);

  // Load history on mount
  const loadChatHistory = async () => {
    try {
      const data = await authFetch("/api/chat/history");
      setHistory(data);
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };

  useEffect(() => {
    loadChatHistory();

    // Check if skill context is passed in URL
    const skillContextId = searchParams.get("skill");
    if (skillContextId) {
      setMessage(`I am studying skill ID: ${skillContextId}. Can you give me a summary of key concepts?`);
    }
  }, [searchParams]);

  // Scroll to bottom helper
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat]);

  // Simple Markdown Parser for AI Responses
  const parseMarkdown = (text) => {
    if (!text) return "";
    
    // Escape HTML tags to prevent XSS
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Code Blocks: ```lang ... ```
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre class="code-block-pre"><div class="code-block-header">${lang || "code"}</div><code>${code.trim()}</code></pre>`;
    });

    // Inline Code: `code`
    html = html.replace(/`([^`\n]+)`/g, "<code>$1</code>");

    // Bold: **text**
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

    // Bullet points: - item
    html = html.replace(/^\s*-\s+(.+)$/gm, "<li>$1</li>");
    // Wrap lists
    html = html.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");

    // Line breaks
    html = html.replace(/\n/g, "<br />");

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  // Chat Submission
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!message.trim() && chatMode === "tutor") return;
    if (!codeSnippet.trim() && chatMode === "code") return;

    setLoading(true);
    setErrorMsg("");

    const userMessageContent = chatMode === "tutor" ? message : `[Code Analysis - ${codeQueryType}] Lang: ${codeLang}`;
    
    // Add user message to active screen
    const newActiveChat = [...activeChat, { role: "user", content: chatMode === "tutor" ? message : codeSnippet, isCode: chatMode === "code" }];
    setActiveChat(newActiveChat);
    setMessage("");

    try {
      if (chatMode === "tutor") {
        const response = await authFetch("/api/chat", {
          method: "POST",
          body: JSON.stringify({
            message: userMessageContent,
            context_skill_id: searchParams.get("skill") ? parseInt(searchParams.get("skill")) : null
          })
        });

        // Add assistant response
        setActiveChat([...newActiveChat, { role: "assistant", content: response.response }]);
        loadChatHistory(); // reload history panel
      } else {
        // Code analysis mode
        const response = await authFetch("/api/chat/code", {
          method: "POST",
          body: JSON.stringify({
            code: codeSnippet,
            language: codeLang,
            query_type: codeQueryType
          })
        });

        setActiveChat([...newActiveChat, { role: "assistant", content: response.response }]);
        setCodeSnippet("");
      }
    } catch (err) {
      console.error("AI chat error:", err);
      setActiveChat([...newActiveChat, { role: "assistant", content: "Error: AI Tutor is currently offline. Please verify your OPENROUTER_API_KEY environment variable." }]);
    } finally {
      setLoading(false);
    }
  };

  const [errorMsg, setErrorMsg] = useState("");

  const triggerSuggestion = (promptText) => {
    setMessage(promptText);
    setChatMode("tutor");
  };

  // Load a historical chat item
  const handleLoadHistoryItem = (item) => {
    setActiveChat([
      { role: "user", content: item.message, isCode: false },
      { role: "assistant", content: item.response }
    ]);
  };

  return (
    <div style={{ display: "flex", gap: "1.5rem", height: "calc(100vh - 120px)" }} className="chat-container">
      
      {/* Left Column: History Panel */}
      <aside className="glass-panel" style={{
        width: "280px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        padding: "1.5rem",
        background: "rgba(9, 9, 21, 0.4)",
        border: "1px solid var(--border-muted)"
      }} className="chat-sidebar">
        <h3 style={{
          fontSize: "1rem",
          fontWeight: 700,
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "var(--text-main)"
        }}>
          <Clock size={16} color="var(--accent-purple)" />
          <span>Syllabus Consults</span>
        </h3>

        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {history.length === 0 ? (
            <div style={{ fontSize: "0.8rem", color: "var(--text-dark)", textAlign: "center", padding: "1rem" }}>
              No past consulting sessions found. Ask questions to populate.
            </div>
          ) : (
            history.map((h) => (
              <div
                key={h.id}
                onClick={() => handleLoadHistoryItem(h)}
                style={{
                  padding: "0.6rem 0.8rem",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--border-muted)",
                  cursor: "pointer",
                  transition: "var(--transition-smooth)",
                  overflow: "hidden"
                }}
                className="history-item"
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent-purple)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-muted)"}
              >
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {h.message}
                </div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-dark)", marginTop: "0.2rem" }}>
                  {new Date(h.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Right Column: Chat Room */}
      <main className="glass-panel" style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* Chat Headers / Modes */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--border-muted)",
          padding: "1rem 1.5rem"
        }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setChatMode("tutor")}
              className="btn btn-secondary"
              style={{
                padding: "0.4rem 1rem",
                fontSize: "0.85rem",
                background: chatMode === "tutor" ? "rgba(139, 92, 246, 0.15)" : "transparent",
                borderColor: chatMode === "tutor" ? "var(--accent-purple)" : "transparent",
                color: chatMode === "tutor" ? "white" : "var(--text-muted)"
              }}
            >
              <HelpCircle size={16} />
              <span>Learning Tutor</span>
            </button>
            <button
              onClick={() => setChatMode("code")}
              className="btn btn-secondary"
              style={{
                padding: "0.4rem 1rem",
                fontSize: "0.85rem",
                background: chatMode === "code" ? "rgba(6, 182, 212, 0.15)" : "transparent",
                borderColor: chatMode === "code" ? "var(--accent-cyan)" : "transparent",
                color: chatMode === "code" ? "white" : "var(--text-muted)"
              }}
            >
              <Code size={16} />
              <span>Code Assistant</span>
            </button>
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-dark)", fontWeight: 600 }}>
            Powered by OpenRouter AI
          </span>
        </div>

        {/* Message Feed */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem"
        }}>
          {activeChat.length === 0 ? (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: "1rem",
              color: "var(--text-dark)",
              textAlign: "center"
            }}>
              <Sparkles size={48} className="pulse-glow" style={{ color: "var(--accent-purple)" }} />
              <div>
                <h4 style={{ color: "white", fontSize: "1.1rem", fontWeight: 700 }}>Initiate Consulting Session</h4>
                <p style={{ fontSize: "0.85rem", maxWidth: "320px", marginTop: "0.25rem" }}>Ask any technical question or paste code debug statements for immediate suggestions.</p>
              </div>
            </div>
          ) : (
            activeChat.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "75%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem"
                }}
              >
                <span style={{
                  fontSize: "0.7rem",
                  color: "var(--text-dark)",
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start"
                }}>
                  {msg.role === "user" ? "You" : "SkillSphere AI"}
                </span>
                
                <div style={{
                  background: msg.role === "user" 
                    ? "linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)" 
                    : "rgba(255, 255, 255, 0.02)",
                  border: msg.role === "user"
                    ? "1px solid rgba(139, 92, 246, 0.3)"
                    : "1px solid var(--border-muted)",
                  padding: "0.85rem 1.25rem",
                  borderRadius: "12px",
                  fontSize: "0.9rem",
                  lineHeight: 1.5,
                  color: "white"
                }} className={msg.isCode ? "code-message" : ""}>
                  {msg.isCode ? (
                    <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "0.8rem", overflowX: "auto" }}>
                      <code>{msg.content}</code>
                    </pre>
                  ) : (
                    parseMarkdown(msg.content)
                  )}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              <Terminal size={14} className="pulse-glow" style={{ color: "var(--accent-cyan)" }} />
              <span className="pulse-glow">AI is formulating response...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Prompts */}
        {activeChat.length === 0 && (
          <div style={{
            display: "flex",
            gap: "0.5rem",
            padding: "0 1.5rem",
            flexWrap: "wrap",
            justifyContent: "center"
          }}>
            {[
              "Explain OOP Polymorphism in simple terms",
              "Find errors in nested JavaScript for loops",
              "Suggest a beginner roadmap for Rust"
            ].map((s, idx) => (
              <button
                key={idx}
                onClick={() => triggerSuggestion(s)}
                className="btn btn-secondary"
                style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem", borderRadius: "30px" }}
              >
                <span>{s}</span>
                <ArrowRight size={12} />
              </button>
            ))}
          </div>
        )}

        {/* Input Controls */}
        <div style={{ borderTop: "1px solid var(--border-muted)", padding: "1.25rem 1.5rem" }}>
          
          {chatMode === "tutor" ? (
            /* General Chat Input */
            <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "0.75rem" }}>
              <input
                type="text"
                placeholder="Ask your tutor anything (e.g. What is a recursion callback?)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
                style={{ height: "42px", fontSize: "0.9rem" }}
              />
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ height: "42px" }}>
                <Send size={16} />
              </button>
            </form>
          ) : (
            /* Code Analysis Editor Input */
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", gap: "1rem" }}>
                <select
                  value={codeLang}
                  onChange={(e) => setCodeLang(e.target.value)}
                  style={{ height: "36px", fontSize: "0.8rem", width: "130px" }}
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="rust">Rust</option>
                  <option value="go">Go</option>
                </select>

                <select
                  value={codeQueryType}
                  onChange={(e) => setCodeQueryType(e.target.value)}
                  style={{ height: "36px", fontSize: "0.8rem", width: "150px" }}
                >
                  <option value="debug">Detect Errors</option>
                  <option value="explain">Explain Snippet</option>
                  <option value="refactor">Refactor / Optimize</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <textarea
                  placeholder="Paste your source code snippet here..."
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  rows={3}
                  disabled={loading}
                  style={{
                    background: "rgba(3, 3, 5, 0.8)",
                    color: "#f8fafc",
                    fontFamily: "monospace",
                    fontSize: "0.8rem",
                    resize: "none"
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  className="btn btn-accent"
                  disabled={loading || !codeSnippet.trim()}
                  style={{ alignSelf: "flex-end", height: "42px" }}
                >
                  <Bug size={16} />
                  <span>Analyze</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Custom styles for Code Pre formatting inside chat bubble */}
      <style>{`
        .code-block-pre {
          background: #020206 !important;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          padding: 0;
          margin: 0.75rem 0;
          overflow: hidden;
        }
        .code-block-header {
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 0.35rem 0.75rem;
          font-size: 0.7rem;
          color: var(--accent-cyan);
          text-transform: uppercase;
          font-weight: bold;
        }
        .code-block-pre code {
          display: block;
          padding: 0.75rem;
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.8rem;
          color: #f1f5f9;
          overflow-x: auto;
        }
        @media (max-width: 768px) {
          .chat-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatAssistant;
