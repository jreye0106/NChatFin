import { useNavigate } from "react-router-dom";
import { useTheme } from "../styles/ThemeContext";

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: theme.colors.background,
        padding: 20,
      }}
    >
      <h1 style={{ color: theme.colors.text, marginBottom: 40 }}>
        Welcome to NChat
      </h1>

      <button
        onClick={() => navigate("/login")}
        style={btn(theme.colors.primary)}
      >
        Login
      </button>

      <button
        onClick={() => navigate("/signup")}
        style={btn("#888")}
      >
        Sign Up
      </button>
    </div>
  );
}

const btn = (color) => ({
  width: "80%",
  padding: "14px 0",
  borderRadius: 12,
  border: "none",
  background: color,
  color: "white",
  fontSize: 16,
  marginBottom: 14,
  cursor: "pointer",
});
