import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext(null);

export const API_BASE = "http://localhost:8000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("skillsphere_token") || "");
  const [loading, setLoading] = useState(true);

  // Axios/Fetch helper with Auth Header
  const authFetch = async (endpoint, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "API Error" }));
      throw new Error(errorData.detail || "Request failed");
    }
    
    return response.json();
  };

  const fetchProfile = async (activeToken) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        // Token invalid
        logout();
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/login-json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ detail: "Login failed" }));
        throw new Error(err.detail || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("skillsphere_token", data.access_token);
      setToken(data.access_token);
      await fetchProfile(data.access_token);
      return true;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const loginWithGoogle = async (googleIdToken) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: googleIdToken }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Google Login failed");
      }

      const data = await response.json();
      localStorage.setItem("skillsphere_token", data.access_token);
      setToken(data.access_token);
      await fetchProfile(data.access_token);
      return true;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Registration failed");
      }

      // Automatically login after successful signup
      await login(email, password);
      return true;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("skillsphere_token");
    setToken("");
    setUser(null);
    setLoading(false);
  };

  const updateProfile = async (updatedFields) => {
    try {
      const data = await authFetch("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify(updatedFields),
      });
      setUser(data);
      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const triggerProfileRefresh = async () => {
    if (token) {
      await fetchProfile(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        loginWithGoogle,
        signup,
        logout,
        updateProfile,
        authFetch,
        triggerProfileRefresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
