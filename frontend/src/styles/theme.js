export const lightTheme = {
  mode: "light",
  colors: {
    primary: "#4f7cff",
    background: "#f5f7fb",
    card: "#ffffff",
    border: "#e5e5e5",
    text: "#111",
    textLight: "#666",
    danger: "#e74c3c",
  },
  spacing: {
    xs: 6,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 28,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 22,
    round: 999,
  },
  shadow: {
    soft: "0 2px 8px rgba(0,0,0,0.08)",
    medium: "0 4px 12px rgba(0,0,0,0.12)",
  },
  font: {
    title: 26,
    subtitle: 20,
    label: 14,
    body: 15,
    small: 12,
  },
};

export const darkTheme = {
  mode: "dark",
  colors: {
    primary: "#4f7cff",
    background: "#050509",
    card: "#111218",
    border: "#262738",
    text: "#f5f7fb",
    textLight: "#a0a4b8",
    danger: "#ff6b6b",
  },
  spacing: lightTheme.spacing,
  radius: lightTheme.radius,
  shadow: {
    soft: "0 2px 14px rgba(0,0,0,0.6)",
    medium: "0 6px 20px rgba(0,0,0,0.75)",
  },
  font: lightTheme.font,
};
