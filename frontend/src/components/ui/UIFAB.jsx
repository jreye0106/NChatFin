import { useTheme } from "../../styles/ThemeContext";

export default function UIFAB({ onClick }) {
  const { theme } = useTheme();

  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        bottom: "90px",   // ⭐ lifted higher so it never gets swallowed
        right: "24px",    // ⭐ moved slightly inward
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        background: theme.colors.primary,
        color: "white",
        fontSize: "32px",
        border: "none",
        cursor: "pointer",
        boxShadow: theme.shadow.medium,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      +
    </button>
  );
}
