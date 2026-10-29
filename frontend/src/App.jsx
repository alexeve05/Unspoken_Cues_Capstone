import React, { useState, useEffect } from "react";
import { fetchCurrentSession, logoutStaff } from "./authService";
import "./App.css";
import LoginScreen from "./LoginScreen";

const NAV_ITEMS = [
  { id: "dashboard", label: "Staff Dashboard", adminOnly: false },
];

function App() {
  const [apiMessage, setApiMessage] = useState("Checking backend...");
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    fetch("http://localhost:3000/api/health")
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
  const isBlockedAdminPage =
    currentTabMeta.adminOnly && currentUser.role !== "admin";
}

export default App;
