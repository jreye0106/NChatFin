import { useEffect, useState } from "react";
import { apiGet } from "../api";
import { useNavigate } from "react-router-dom";
import {
  registerPresenceHandlers,
  registerMessageHandlers,
} from "../socket";

export default function ChatListScreen({ myId, token }) {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadChats();

    // Real-time updates
    registerMessageHandlers(() => loadChats());
    registerPresenceHandlers(() => loadChats());
  }, []);

  const loadChats = async () => {
    const data = await apiGet("/api/chatlist", token);
    setChats(data || []);
  };

  const timeAgo = (date) => {
    if (!date) return "";
    const diff = (Date.now() - new Date(date)) / 1000;

    if (diff < 60) return "just now";
    if (diff < 3600) return Math.floor(diff / 60) + "m";
    if (diff < 86400) return Math.floor(diff / 3600) + "h";
    return Math.floor(diff / 86400) + "d";
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Chats</h2>

      {chats.map((chat) => (
        <div
          key={chat.user._id}
          style={styles.row}
          onClick={() =>
            navigate(`/app/chat/${chat.user._id}`, {
              state: { otherUser: chat.user },
            })
          }
        >
          <img
            src={chat.user.avatar || "/default-avatar.png"}
            style={styles.avatar}
          />

          <div style={{ flex: 1 }}>
            <div style={styles.usernameRow}>
              <span style={styles.username}>{chat.user.username}</span>
              <span style={styles.time}>
                {timeAgo(chat.lastMessage?.createdAt)}
              </span>
            </div>

            <div style={styles.previewRow}>
              <span style={styles.preview}>
                {chat.lastMessage?.decryptedText ||
                  (chat.lastMessage?.attachmentUrl ? "Attachment" : "No messages yet")}
              </span>

              {chat.unreadCount > 0 && (
                <span style={styles.unread}>{chat.unreadCount}</span>
              )}
            </div>
          </div>

          {chat.user.online && <div style={styles.onlineDot}></div>}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 20,
  },
  row: {
    display: "flex",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #eee",
    cursor: "pointer",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    marginRight: 12,
  },
  usernameRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  username: {
    fontWeight: 600,
  },
  time: {
    fontSize: 12,
    opacity: 0.6,
  },
  previewRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  preview: {
    fontSize: 14,
    opacity: 0.7,
    maxWidth: "80%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  unread: {
    background: "#4f7cff",
    color: "white",
    padding: "2px 8px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 600,
  },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: "#4cd964",
    marginLeft: 10,
  },
};
