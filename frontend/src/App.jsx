import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Components
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import GlowingBackground from "./components/GlowingBackground";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Skills from "./pages/Skills";
import SkillDetail from "./pages/SkillDetail";
import Practice from "./pages/Practice";
import ChatAssistant from "./pages/ChatAssistant";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";

// Layout Wrapper to conditionally render navbar/sidebar
const AppLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Routes that do NOT require the sidebar layout
  const noSidebarRoutes = ["/", "/login", "/signup", "/forgot-password"];
  const isNoSidebar = noSidebarRoutes.includes(location.pathname);

  if (isNoSidebar || !user) {
    return <>{children}</>;
  }

  return (
    <div className="app-container">
      {/* Decorative Orbs */}
      <GlowingBackground />

      {/* Sidebar Drawer */}
      <div className={`sidebar-drawer ${mobileSidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </div>
      
      {/* Sidebar Overlay backdrop for mobile */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 8,
            backdropFilter: "blur(2px)"
          }}
        />
      )}

      {/* Main Core View Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <main className="main-content" style={{ marginTop: "70px" }}>
          {children}
        </main>
      </div>

      {/* Media styling styles */}
      <style>{`
        .sidebar-drawer {
          transition: transform 0.3s ease-in-out;
        }
        @media (max-width: 1024px) {
          .sidebar-drawer {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            width: 260px;
            transform: translateX(-100%);
            z-index: 15;
          }
          .sidebar-drawer.open {
            transform: translateX(0);
          }
          #mobile-nav-toggle {
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  );
};

const AppContent = () => {
  return (
    <AppLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/skills" element={
          <ProtectedRoute>
            <Skills />
          </ProtectedRoute>
        } />
        <Route path="/skills/:skill_id" element={
          <ProtectedRoute>
            <SkillDetail />
          </ProtectedRoute>
        } />
        <Route path="/practice" element={
          <ProtectedRoute>
            <Practice />
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute>
            <ChatAssistant />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <AdminPanel />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
};

const App = () => {
  // Google Client ID is configured via environment variables.
  // Standard fallback Google button handles logins if this value is empty.
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "placeholder-client-id";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
