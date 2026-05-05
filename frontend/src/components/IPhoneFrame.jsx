import { useEffect, useRef, useState } from "react";
import { useTheme } from "../styles/ThemeContext";

export default function IPhoneFrame({ children }) {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  const BASE_WIDTH = 430;
  const BASE_HEIGHT = 932;

  useEffect(() => {
    function updateScale() {
      if (!containerRef.current) return;

      const { clientWidth, clientHeight } = containerRef.current;

      const scaleW = clientWidth / BASE_WIDTH;
      const scaleH = clientHeight / BASE_HEIGHT;

      const finalScale = Math.min(scaleW, scaleH) * 0.92;

      setScale(finalScale);
    }

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: theme.mode === "light" ? "#e5e5e5" : "#000",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "40px",
            overflow: "hidden",
            background: theme.colors.background,
            boxShadow:
              "0 20px 40px rgba(0,0,0,0.25), 0 0 0 10px rgba(0,0,0,0.85)",
            position: "relative",
          }}
        >
          {/* Dynamic Island */}
          <div
            style={{
              position: "absolute",
              top: 18,
              left: "50%",
              transform: "translateX(-50%)",
              width: 120,
              height: 35,
              background: "#000",
              borderRadius: 20,
              zIndex: 20,
            }}
          />

          {/* Screen content */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflowY: "auto",        // ⭐ scroll fix
              WebkitOverflowScrolling: "touch",
              display: "flex",
              flexDirection: "column",
              paddingBottom: 20,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
