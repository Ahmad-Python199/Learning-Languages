import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#050508",
        color: "#8b5cf6",
        fontFamily: "sans-serif",
        fontSize: "1.2rem",
        fontWeight: "bold"
      }}>
        <div className="pulse-glow">Loading SkillSphere...</div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    // Redirect to dashboard if trying to access admin panel without permission
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
