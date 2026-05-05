import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../styles/ThemeContext";
import { apiPost } from "../api";

export default function CreateGroupScreen({ token, user }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Members passed from previous screen
  const members = location.state?.members || [];

  const [groupName, setGroupName] = useState("");

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;

    try {
      const payload = {
        name: groupName,
        members: [...members, user._id], // include yourself
      };

      const group = await apiPost("/api/groups/create", payload, token);

      navigate(`/app/chat/${group._id}`);
    } catch (err) {
      console.error("Failed to create group", err);
    }
  };

  return (
    <div style={{ width: "100%", paddingTop: 10 }}>
      {/* GROUP NAME INPUT */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: 14,
            border: `1px solid ${theme.colors.border}`,
            background:
              theme.mode === "light"
                ? "rgba(240,240,240,0.9)"
                : "rgba(40,40,50,0.8)",
            color: theme.colors.text,
            fontSize: theme.font.body,
            outline: "none",
          }}
        />
      </div>

      {/* SELECTED MEMBERS */}
      <div
        style={{
          marginBottom: 20,
          fontWeight: 600,
          color: theme.colors.text,
        }}
      >
        Members ({members.length})
      </div>

      {members.map((id) => (
        <div
          key={id}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 0",
            borderBottom: `1px solid ${theme.colors.border}`,
          }}
        >
          <img
            src={"/default-avatar.png"}
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              marginRight: 14,
              objectFit: "cover",
              boxShadow: theme.shadow.soft,
            }}
          />

          <div style={{ color: theme.colors.text }}>
            {id}
          </div>
        </div>
      ))}

      {/* CREATE GROUP BUTTON */}
      <div
        onClick={handleCreateGroup}
        style={{
          position: "absolute",
          bottom: 90,
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          padding: "14px 0",
          background: theme.colors.primary,
          color: "white",
          textAlign: "center",
          borderRadius: 14,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: theme.shadow.medium,
        }}
      >
        Create Group
      </div>
    </div>
  );
}
