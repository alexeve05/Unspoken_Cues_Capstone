import React, { useState, useEffect } from "react";
import { fetchCurrentSession, logoutStaff } from "./authService";
import "./App.css";
import LoginScreen from "./LoginScreen";

const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:3000";

const NAV_ITEMS = [
  { id: "dashboard", label: "Staff Dashboard", adminOnly: false },
];

function App() {
  const [apiMessage, setApiMessage] = useState("Checking backend...");
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    fetch(`${API_ROOT}/api/health`)
      .then((response) => response.json())
      .then((data) => setApiMessage(data.message || "Connected to backend"))
      .catch(() => setApiMessage("Unable to connect to backend"));

    // Check if staff member already has an active login session
    fetchCurrentSession().then((user) => {
      setCurrentUser(user);
      setCheckingSession(false);
    });
  }, []);

  const handleLogout = async () => {
    await logoutStaff();
    setCurrentUser(null);
    setActivePage("dashboard");
  };

  const isBackendOffline = apiMessage === "Unable to connect to backend";

  if (checkingSession) {
    return <div className="session-loading">Checking session...</div>;
  }

  // Forces LoginScreen first if not logged in
  if (!currentUser) {
    return (
      <div>
        <div
          className={`backend-status-banner ${isBackendOffline ? "offline" : "online"}`}
        >
          <strong>Unspoken Cues — Resort/Event Management Platform:</strong>{" "}
          {apiMessage}
        </div>
        <LoginScreen
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setActivePage("dashboard");
          }}
        />
      </div>
    );
  }

  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || currentUser.role === "admin",
  );

  const currentTabMeta =
    NAV_ITEMS.find((item) => item.id === activePage) || NAV_ITEMS[0];
  // Only protects UI. Actual security is from requireAdmin on the server.
  const isBlockedAdminPage =
    currentTabMeta.adminOnly && currentUser.role !== "admin";

  // Placeholder dashboard layout
  return (
    <div>
      <div
        className={`backend-status-banner ${isBackendOffline ? "offline" : "online"}`}
      >
        {apiMessage}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 24px" }}>
        <div style={{ textAlign: "left" }}>
          <h2>Unspoken Cues</h2>
          <p className="sidebar-subtitle">{currentUser.assigned_venue}</p>
        </div>
        <div className="header-right-group">
          <span>
            {currentUser.name} ({currentUser.role})
          </span>
          <button type="button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
      <nav style={{ padding: "0 24px", textAlign: "left" }}>
        {visibleNavItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActivePage(item.id)}
            disabled={item.id === activePage}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <main style={{ padding: 24, textAlign: "left" }}>
        {isBlockedAdminPage ? (
          <p>You don't have permission to view this page.</p>
        ) : (
          <h2>{currentTabMeta.label}</h2>
        )}
      </main>
    </div>
  );
}

export default App;