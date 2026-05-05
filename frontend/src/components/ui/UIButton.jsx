import { useTheme } from "../../styles/ThemeContext";

export default function UIButton({ children, type = "primary", onClick }) {
  const { theme } = useTheme();

  const base = {
    padding: "12px",
    borderRadius: theme.radius.md,
    fontSize: theme.font.body,
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
    width: "100%",
    transition: "0.2s",
  };

  const types = {
    primary: {
      background: theme.colors.primary,
      color: "white",
    },
    secondary: {
      background: theme.colors.card,
      color: theme.colors.text,
      border: `1px solid ${theme.colors.border}`,
    },
    danger: {
      background: theme.colors.danger,
      color: "white",
    },
  };

  return (
    <button
      style={{ ...base, ...types[type] }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
