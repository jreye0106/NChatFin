import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../api";
import { useTheme } from "../styles/ThemeContext";

export default function CreateNewMessageScreen({ token, user }) {
  const { theme } = useTheme();
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  // ⭐ Debug logs
  console.log("LOGGED IN USER:", user);
  console.log("LOGGED IN USER ID:", user?._id);
  console.log("FRIENDS STATE:", friends);

  // ⭐ Load friends even if user is not ready yet
  useEffect(() => {
    async function loadFriends() {
      try {
        const data = await apiGet("/api/friends/list", token);
        console.log("RAW FRIENDS FROM BACKEND:", data);

        const arr = Array.isArray(data) ? data : [];
        setFriends(arr);
      } catch (err) {
        console.error("Failed to load friends", err);
        setFriends([]);
      }
    }

    if (token) loadFriends();
  }, [token]);

  // ⭐ Search filter only
  const filteredFriends = friends.filter((f) => {
    if (!f || !f.username) return false;
    return f.username.toLowerCase().includes(search.toLowerCase());
  });

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAction = () => {
    if (selected.length === 1) {
      navigate(`/app/chat/${selected[0]}`);
    } else if (selected.length > 1) {
      navigate(`/app/create-group`, { state: { members: selected } });
    }
  };

  return (
    <div style={{ width: "100%", paddingTop: 10 }}>
      {/* SEARCH BAR */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search friends…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
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

      {/* FRIEND LIST */}
      {filteredFriends.length === 0 && (
        <div style={{ color: theme.colors.text, opacity: 0.6 }}>
          No friends found
        </div>
      )}

      {filteredFriends.map((f) => (
        <div
          key={f._id}
          onClick={() => toggleSelect(f._id)}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "14px 0",
            borderBottom: `1px solid ${theme.colors.border}`,
            cursor: "pointer",
          }}
        >
          <img
            src={f.avatar || "/default-avatar.png"}
            alt=""
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              marginRight: 14,
              objectFit: "cover",
              boxShadow: theme.shadow.soft,
            }}
          />

          <div style={{ flex: 1, color: theme.colors.text }}>
            {f.username}
          </div>

          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              border: `2px solid ${theme.colors.primary}`,
              background: selected.includes(f._id)
                ? theme.colors.primary
                : "transparent",
              transition: "0.2s",
            }}
          />
        </div>
      ))}

      {/* ACTION BUTTON */}
      {selected.length > 0 && (
        <div
          onClick={handleAction}
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
          {selected.length === 1 ? "Start Chat" : "Create Group"}
        </div>
      )}
    </div>
  );
}
