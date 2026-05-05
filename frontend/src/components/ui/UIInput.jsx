import { useTheme } from "../../styles/ThemeContext";

export default function UIInput({ value, onChange, placeholder }) {
  const { theme } = useTheme();

  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: theme.radius.md,
        border: `1px solid ${theme.colors.border}`,
        background: theme.colors.card,
        color: theme.colors.text,
        fontSize: theme.font.body,
        outline: "none",
        transition: "0.2s",
      }}
    />
  );
}
