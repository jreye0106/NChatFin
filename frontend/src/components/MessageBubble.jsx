import { useTheme } from "../styles/ThemeContext";

export default function MessageBubble({ message, isMe, showName }) {
  const { theme } = useTheme();

  const bubbleColor = isMe
    ? theme.colors.primary
    : theme.mode === "light"
    ? "#E9E9EB"
    : "#2F2F33";

  const textColor = isMe ? "white" : theme.colors.text;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isMe ? "flex-end" : "flex-start",
        marginBottom: 6,
        paddingLeft: isMe ? 40 : 0,
        paddingRight: isMe ? 0 : 40,
      }}
    >
      <div>
        {/* Sender name (group chats only) */}
        {showName && !isMe && (
          <div
            style={{
              fontSize: 12,
              marginLeft: 6,
              marginBottom: 2,
              color: theme.colors.textLight,
              fontWeight: 600,
            }}
          >
            {message.senderName}
          </div>
        )}

        {/* Bubble */}
        <div
          style={{
            maxWidth: "75%",
            padding: "10px 14px",
            borderRadius: 18,
            background: bubbleColor,
            color: textColor,
            fontSize: 15,
            lineHeight: 1.35,
            borderTopRightRadius: isMe ? 4 : 18,
            borderTopLeftRadius: isMe ? 18 : 4,
            boxShadow: theme.shadow.soft,
            wordBreak: "break-word",
          }}
        >
          {message.decryptedText || message.encryptedContent}

        </div>

        {/* Timestamp */}
        <div
          style={{
            fontSize: 11,
            opacity: 0.5,
            marginTop: 3,
            textAlign: isMe ? "right" : "left",
            marginLeft: isMe ? 0 : 6,
            marginRight: isMe ? 6 : 0,
          }}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}

