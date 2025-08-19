import React from "react";

export default function ThemeSwitch({ isDark, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      padding: "8px 16px",
      borderRadius: "8px",
      border: "none",
      background: isDark ? "#222" : "#eee",
      color: isDark ? "#fff" : "#222",
      cursor: "pointer",
      margin: "16px 0"
    }}>
      {isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
}
