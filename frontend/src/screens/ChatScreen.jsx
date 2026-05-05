import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { apiGet, apiPut, apiPost } from "../api";

import {
  connectSocket,
  registerPresenceHandlers,
  registerTypingHandlers,
  registerMessageHandlers,
  registerReactionHandlers,
  registerDeliveryHandlers,
  registerReadHandlers,
  sendTyping,
  stopTyping,
  sendReaction,
  emitDelivered,
  emitRead,
} from "../socket";

import MessageBubble from "../components/MessageBubble";
import TypingIndicator from "../components/TypingIndicator";

export default function ChatScreen({ myId, token }) {
  const { id: otherUserId } = useParams();
  const location = useLocation();

  const [otherUser, setOtherUser] = useState(location.state?.otherUser || null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [online, setOnline] = useState(false);

  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  // ---------------------------------------
  // FORCE TOKEN INTO AXIOS
  // ---------------------------------------
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, [token]);

  // ---------------------------------------
  // FETCH OTHER USER IF NOT PROVIDED
  // ---------------------------------------
  useEffect(() => {
    if (!otherUser) {
      apiGet(`/api/profile/user/${otherUserId}`, token).then((data) => {
        setOtherUser(data);
      });
    }
  }, [otherUser, otherUserId, token]);

  // ---------------------------------------
  // SOCKET + CONVERSATION LOADING
  // ---------------------------------------
  useEffect(() => {
    if (!otherUser) return;

    connectSocket(myId);

    loadConversation();
    markAsRead();

    // 🔥 NEW: socket messages already contain decryptedText
    registerMessageHandlers((msg) => {
      if (
        (msg.senderId === otherUser._id && msg.receiverId === myId) ||
        (msg.senderId === myId && msg.receiverId === otherUser._id)
      ) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    });

    registerReactionHandlers((data) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === data.messageId ? { ...m, reactions: data.reactions } : m
        )
      );
    });

    registerTypingHandlers((senderId, isTyping) => {
      if (senderId === otherUser._id) {
        setIsOtherTyping(isTyping);
      }
    });

    registerPresenceHandlers((userId, isOnline) => {
      if (userId === otherUser._id) {
        setOnline(isOnline);
      }
    });

    registerDeliveryHandlers((messageId, deliveredAt) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, deliveredAt } : m
        )
      );
    });

    registerReadHandlers((readerId, readAt) => {
      if (readerId === otherUser._id) {
        setMessages((prev) =>
          prev.map((m) =>
            m.receiverId === myId ? { ...m, read: true, readAt } : m
          )
        );
      }
    });
  }, [otherUser, myId, token]);

  // ---------------------------------------
  // CONDITIONAL RENDER
  // ---------------------------------------
  if (!otherUser) {
    return <div style={{ padding: 20 }}>Loading chat…</div>;
  }

  // ---------------------------------------
  // FUNCTIONS
  // ---------------------------------------

  const loadConversation = async () => {
    const data = await apiGet(
      `/api/messages/conversation/${otherUser._id}`,
      token
    );

    setMessages(data); // 🔥 backend already includes decryptedText
    scrollToBottom();
  };

  const markAsRead = async () => {
    await apiPut(`/api/messages/read/${otherUser._id}`, {}, token);
    emitRead(myId, otherUser._id);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleTyping = (e) => {
    setText(e.target.value);

    sendTyping(myId, otherUser._id);

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      stopTyping(myId, otherUser._id);
    }, 1200);
  };

  // ⭐ UPDATED sendMessage — correct decryptedText flow
  const sendMessage = async () => {
    if (!text.trim()) return;

    const res = await axios.post("/api/messages/send", {
      receiverId: otherUser._id,
      message: text,
    });

    // res.data already contains decryptedText
    setMessages((prev) => [...prev, res.data]);

    setText("");
    scrollToBottom();

    emitDelivered(res.data._id);
  };

  const handleReaction = (messageId, emoji) => {
    sendReaction(messageId, emoji, myId);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);
    fd.append("receiverId", otherUser._id);

    const uploaded = await apiPost("/api/attachments", fd, token);

    setMessages((prev) => [...prev, uploaded]);
    scrollToBottom();
  };

  // ---------------------------------------
  // RENDER
  // ---------------------------------------
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <img
          src={otherUser.avatar || "/default-avatar.png"}
          style={styles.avatar}
        />
        <div>
          <div style={styles.username}>{otherUser.username}</div>
          <div style={styles.status}>
            {online ? "Online" : "Offline"}
            {isOtherTyping && " • typing…"}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={styles.messages}>
        {messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            isMe={msg.senderId?.toString() === myId}
            showName={false}
            onReact={handleReaction}
          />
        ))}
      </div>

      {isOtherTyping && <TypingIndicator />}

      <div ref={bottomRef}></div>

      {/* Input Bar */}
      <div style={styles.inputContainer}>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />

        <button
          style={styles.plusBtn}
          onClick={() => document.getElementById("fileInput").click()}
        >
          +
        </button>

        <input
          style={styles.textInput}
          value={text}
          onChange={handleTyping}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Message…"
        />

        <button style={styles.sendBtn} onClick={sendMessage}>
          ➤
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------
// STYLES (your exact styles)
// ---------------------------------------
const styles = {
  container: {
    position: "relative",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f5f7fb",
    overflow: "hidden",
  },

  header: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    paddingTop: "30px",
    paddingBottom: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "white",
    borderBottom: "1px solid #ddd",
    zIndex: 10,
  },

  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    marginRight: "12px",
  },
  username: {
    fontSize: "16px",
    fontWeight: 600,
  },
  status: {
    fontSize: "13px",
    opacity: 0.7,
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    paddingTop: "130px",
    paddingBottom: "90px",
  },

  inputContainer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "10px 14px",
    background: "white",
    borderTop: "1px solid #ddd",
    gap: "10px",
    zIndex: 10,
  },

  plusBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#f0f0f5",
    border: "none",
    fontSize: "22px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#4f7cff",
  },
  textInput: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "15px",
    background: "#fafafa",
  },
  sendBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#4f7cff",
    color: "white",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

