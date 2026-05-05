import { useTheme } from "../../styles/ThemeContext";

export default function UIToggle({ checked, onChange }) {
  const { theme } = useTheme();

  return (
    <label style={{ position: "relative", display: "inline-block", width: 44, height: 24 }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ opacity: 0, width: 0, height: 0 }}
      />

      <span
        style={{
          position: "absolute",
          cursor: "pointer",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: checked ? theme.colors.primary : theme.colors.border,
          borderRadius: 24,
          transition: "0.3s",
        }}
      />

      <span
        style={{
          position: "absolute",
          height: 18,
          width: 18,
          left: checked ? 22 : 4,
          bottom: 3,
          background: theme.colors.card,
          borderRadius: "50%",
          transition: "0.3s",
          boxShadow: theme.shadow.soft,
        }}
      />
    </label>
  );
}
