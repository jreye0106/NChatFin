import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../api";
import { useTheme } from "../styles/ThemeContext";

export default function SignupScreen() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    if (!form.username || !form.email || !form.password) return;

    const data = await apiPost("/api/auth/signup", form);

    if (data.success) {
      navigate("/login");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: theme.colors.text }}>Create Account</h2>

      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        style={input(theme)}
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        style={input(theme)}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        style={input(theme)}
      />

      <button onClick={handleSignup} style={btn(theme.colors.primary)}>
        Sign Up
      </button>
    </div>
  );
}

const input = (theme) => ({
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: `1px solid ${theme.colors.border}`,
  marginBottom: 14,
  background: theme.colors.card,
  color: theme.colors.text,
});

const btn = (color) => ({
  width: "100%",
  padding: "14px 0",
  borderRadius: 12,
  border: "none",
  background: color,
  color: "white",
  fontSize: 16,
  cursor: "pointer",
});
