import { useTheme } from "../../styles/ThemeContext";

export default function UITextArea({ value, onChange, placeholder }) {
  const { theme } = useTheme();

  return (
    <textarea
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
        minHeight: "80px",
        resize: "none",
        transition: "0.2s",
      }}
    />
  );
}
