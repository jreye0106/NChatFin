import { useTheme } from "../../styles/ThemeContext";

export default function UISection({ title, children }) {
  const { theme } = useTheme();

  return (
    <div style={{ marginBottom: theme.spacing.lg }}>
      <div
        style={{
          fontSize: theme.font.label,
          fontWeight: 600,
          marginBottom: theme.spacing.sm,
          color: theme.colors.textLight,
        }}
      >
        {title}
      </div>

      <div
        style={{
          background: theme.colors.card,
          padding: theme.spacing.md,
          borderRadius: theme.radius.lg,
          boxShadow: theme.shadow.soft,
          border: `1px solid ${theme.colors.border}`,
          transition: "0.2s",
        }}
      >
        {children}
      </div>
    </div>
  );
}
