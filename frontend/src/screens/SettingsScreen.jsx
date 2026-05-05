import { useTheme } from "../styles/ThemeContext";

export default function SettingsScreen({ user }) {
  const { theme } = useTheme();

  return (
    <div
      style={{
        padding: 16,
        background: theme.colors.background,
        minHeight: "100vh",
      }}
    >
      {/* PROFILE HEADER */}
      <div
        style={{
          background: theme.colors.card,
          padding: 16,
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          marginBottom: 20,
          boxShadow: theme.shadow.soft,
        }}
      >
        <img
          src={user.avatar || "/default-avatar.png"}
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            marginRight: 16,
            objectFit: "cover",
          }}
        />

        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: theme.colors.text,
            }}
          >
            {user.username}
          </div>
          <div
            style={{
              fontSize: 14,
              opacity: 0.6,
              color: theme.colors.text,
            }}
          >
            {user.email}
          </div>
        </div>
      </div>

      {/* GENERAL SETTINGS */}
      <div
        style={{
          background: theme.colors.card,
          borderRadius: 16,
          padding: 12,
          marginBottom: 20,
          boxShadow: theme.shadow.soft,
        }}
      >
        <SettingRow label="Notifications" />
        <SettingRow label="Privacy" />
        <SettingRow label="Appearance" />
      </div>

      {/* ACCOUNT SETTINGS */}
      <div
        style={{
          background: theme.colors.card,
          borderRadius: 16,
          padding: 12,
          marginBottom: 20,
          boxShadow: theme.shadow.soft,
        }}
      >
        <SettingRow label="Change Password" />
        <SettingRow label="Blocked Users" />
      </div>

      {/* LOGOUT BUTTON */}
      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
        style={{
          width: "100%",
          padding: "14px 0",
          background: "#ff3b30",
          color: "white",
          border: "none",
          borderRadius: 12,
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: theme.shadow.medium,
        }}
      >
        Log Out
      </button>
    </div>
  );
}

/* Reusable iOS-style row */
function SettingRow({ label }) {
  const { theme } = useTheme();

  return (
    <div
      style={{
        padding: "14px 4px",
        borderBottom: `1px solid ${theme.colors.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <span style={{ color: theme.colors.text, fontSize: 16 }}>{label}</span>
      <span style={{ opacity: 0.4, fontSize: 18 }}>›</span>
    </div>
  );
}
