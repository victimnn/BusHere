import React, { createContext, useContext, useEffect, useState } from "react";

const KeybindContext = createContext();

export const KeybindProvider = ({ children }) => {
  // Modos: Disabled, Simple, Alt
  const [keybindMode, setKeybindMode] = useState("Alt"); // Default: Alt

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (keybindMode === "Disabled") return;
      // Simple: 1,2,3... ou Alt+1...Alt+9
      if (["1","2","3","4","5","6","7","8","9"].includes(e.key)) {
  let keybindId = `sidebar-${e.key}`;
        if (
          (keybindMode === "Simple") ||
          (keybindMode === "Alt" && e.altKey)
        ) {
          // Foca a sidebar se for um botão da sidebar
          if (keybindId.startsWith('sidebar-')) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.focus();
          }
          // Clica no botão normalmente
          const btn = document.querySelector(`[data-keybind-id='${keybindId}']`);
          if (btn) {
            console.log(`[Keybind] Found button for ${keybindId}, clicking.`);
            btn.click();
          } else {
            console.warn(`[Keybind] No button found for ${keybindId}`);
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keybindMode]);

  return (
    <KeybindContext.Provider value={{ keybindMode, setKeybindMode }}>
      {children}
    </KeybindContext.Provider>
  );
};

export const useKeybinds = () => useContext(KeybindContext);
