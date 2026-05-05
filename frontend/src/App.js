import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

// Auth Screens
import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";

// App Screens
import ChatListScreen from "./screens/ChatListScreen";
import DiscoverScreen from "./screens/DiscoverScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ChatScreen from "./screens/ChatScreen";
import CreateNewMessageScreen from "./screens/CreateNewMessageScreen";
import CreateGroupScreen from "./screens/CreateGroupScreen";

// Layout
import MainLayout from "./layouts/MainLayout";
import IPhoneFrame from "./components/IPhoneFrame";

// Theme Provider
import { ThemeProvider } from "./styles/ThemeContext";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // ⭐ Badge count for incoming friend requests
  const [incomingCount, setIncomingCount] = useState(0);

  // ---------------------------------------
  // Load saved login
  // ---------------------------------------
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);

      // ⭐ Apply token globally
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }
  }, []);

  // ---------------------------------------
  // Apply token globally whenever it changes
  // ---------------------------------------
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  // ---------------------------------------
  // Login handler
  // ---------------------------------------
  const handleLogin = (u, t) => {
    setUser(u);
    setToken(t);

    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("token", t);

    // ⭐ Apply token globally
    axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
  };

  return (
    <ThemeProvider>
      <Router>
        <Routes>

          {/* ⭐ AUTH ROUTES */}
          {!user || !token ? (
            <>
              <Route
                path="/"
                element={
                  <IPhoneFrame>
                    <WelcomeScreen />
                  </IPhoneFrame>
                }
              />

              <Route
                path="/login"
                element={
                  <IPhoneFrame>
                    <LoginScreen onLogin={handleLogin} />
                  </IPhoneFrame>
                }
              />

              <Route
                path="/signup"
                element={
                  <IPhoneFrame>
                    <SignupScreen />
                  </IPhoneFrame>
                }
              />

              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              {/* ⭐ MAIN APP ROUTES */}
              <Route
                path="/app"
                element={
                  <MainLayout
                    incomingCount={incomingCount}
                    token={token}
                  />
                }
              >

                {/* ⭐ CHAT LIST SCREEN */}
                <Route
                  path="chats"
                  element={<ChatListScreen myId={user._id} token={token} />}
                />

                {/* ⭐ NEW MESSAGE SCREEN */}
                <Route
                  path="chats/new"
                  element={<CreateNewMessageScreen token={token} />}
                />

                {/* ⭐ GROUP CREATION */}
                <Route
                  path="create-group"
                  element={<CreateGroupScreen token={token} user={user} />}
                />

                {/* ⭐ CHAT SCREEN */}
                <Route
                  path="chat/:id"
                  element={<ChatScreen myId={user._id} token={token} />}
                />

                {/* ⭐ DISCOVER — with badge sync */}
                <Route
                  path="discover"
                  element={
                    <DiscoverScreen
                      user={user}
                      token={token}
                      onIncomingChange={(count) => setIncomingCount(count)}
                    />
                  }
                />

                {/* ⭐ PROFILE */}
                <Route
                  path="profile"
                  element={<ProfileScreen user={user} token={token} />}
                />

                {/* ⭐ SETTINGS */}
                <Route
                  path="settings"
                  element={<SettingsScreen user={user} />}
                />

              </Route>

              {/* ⭐ DEFAULT REDIRECT */}
              <Route path="*" element={<Navigate to="/app/chats" />} />
            </>
          )}

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
