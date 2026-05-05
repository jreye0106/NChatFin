import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../styles/ThemeContext";
import IPhoneFrame from "../components/IPhoneFrame";
import UIFAB from "../components/ui/UIFAB";
import { useEffect, useState } from "react";
import { apiGet } from "../api";


export default function MainLayout() {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Root tabs (no back button)
  const rootTabs = ["/app/chats", "/app/discover", "/app/profile", "/app/settings"];

  const isRoot = rootTabs.includes(location.pathname);

  // Title logic
  const getTitle = () => {
    if (location.pathname.startsWith("/app/chat/")) return "Messages";
    if (location.pathname === "/app/chats") return "Chats";
    if (location.pathname === "/app/discover") return "Discover";
    if (location.pathname === "/app/profile") return "Profile";
    if (location.pathname === "/app/settings") return "Settings";
    if (location.pathname === "/app/chats/new") return "New Chat";
    return "";
  };

  const title = getTitle();

  // Back button logic
  const showBack = !isRoot;

  // FAB only on chats root
  const showFAB = location.pathname === "/app/chats";

  return (
    <IPhoneFrame>
      {/* FLOATING GLASS HEADER */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: 0,
          right: 0,
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          backdropFilter: "blur(20px)",
          background:
            theme.mode === "light"
              ? "rgba(255,255,255,0.55)"
              : "rgba(20,20,25,0.45)",
          borderBottom: `1px solid ${theme.colors.border}`,
          zIndex: 20,
        }}
      >
        {/* BACK BUTTON */}
        {showBack && (
          <div
            onClick={() => navigate(-1)}
            style={{
              padding: "6px 12px",
              borderRadius: theme.radius.md,
              background:
                theme.mode === "light"
                  ? "rgba(255,255,255,0.7)"
                  : "rgba(40,40,50,0.6)",
              boxShadow: theme.shadow.soft,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              color: theme.colors.text,
            }}
          >
            ← Back
          </div>
        )}

        {/* TITLE */}
        <div
          style={{
            fontSize: showBack ? theme.font.subtitle : theme.font.title,
            fontWeight: showBack ? 600 : 700,
            color: theme.colors.text,
          }}
        >
          {title}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div
        style={{
          position: "absolute",
          top: "16%",
          bottom: "12%",
          left: 0,
          right: 0,
          overflowY: "auto",
          padding: "0 20px",
        }}
      >
        <Outlet />
      </div>

      {/* BOTTOM TAB BAR */}
      {isRoot && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "12%",
            background: theme.colors.card,
            borderTop: `1px solid ${theme.colors.border}`,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            boxShadow: theme.shadow.soft,
            zIndex: 15,
          }}
        >
          <TabItem label="Chats" path="/app/chats" location={location} navigate={navigate} />
          <TabItem label="Discover" path="/app/discover" location={location} navigate={navigate} />
          <TabItem label="Profile" path="/app/profile" location={location} navigate={navigate} />
          <TabItem label="Settings" path="/app/settings" location={location} navigate={navigate} />
        </div>
      )}

      {/* FAB (only on chats root) */}
      {showFAB && (
        <UIFAB onClick={() => navigate("/app/chats/new")} />
      )}
    </IPhoneFrame>
  );
}

function TabItem({ label, path, location, navigate }) {
  const { theme } = useTheme();
  const active = location.pathname === path;

  return (
    <div
      onClick={() => navigate(path)}
      style={{
        textAlign: "center",
        cursor: "pointer",
        color: active ? theme.colors.primary : theme.colors.textLight,
        fontWeight: active ? 700 : 500,
        fontSize: 14,
      }}
    >
      {label}
    </div>
  );
}