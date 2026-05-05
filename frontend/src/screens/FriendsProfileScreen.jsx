import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../api";
import { useTheme } from "../styles/ThemeContext";

export default function FriendProfileScreen({ user, token }) {
  const { theme } = useTheme();
  const { id } = useParams(); // friend userId
  const navigate = useNavigate();

  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFriend();
  }, []);

  const loadFriend = async () => {
    setLoading(true);
    const data = await apiGet(`/api/profile/user/${id}`, token);
    setFriend(data);
    setLoading(false);
  };

  const removeFriend = async () => {
    await apiPost(`/api/friends/remove/${friend.friendshipId}`, {}, token);
    navigate("/app/friends");
  };

  const startChat = () => {
    navigate(`/app/chat/${friend._id}`);
  };

  if (loading || !friend) {
    return <p style={{ padding: 20 }}>Loading…</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      {/* Avatar */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <img
          src={friend.avatar || "/default-avatar.png"}
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            marginBottom: 10,
          }}
        />
        <h2>{friend.username}</h2>
        <p style={{ opacity: 0.6 }}>{friend.email}</p>
      </div>

      {/* Buttons */}
      <div style={{ marginTop: 30 }}>
        <Button
          label="Start Chat"
          color={theme.colors.primary}
          onClick={startChat}
        />

        <Button
          label="Remove Friend"
          color="#ff4d4d"
          onClick={removeFriend}
        />
      </div>
    </div>
  );
}

function Button({ label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: 14,
        borderRadius: 12,
        border: "none",
        background: color,
        color: "white",
        fontSize: 16,
        marginBottom: 12,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
