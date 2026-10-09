import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext({
  theme: "dark",
  setTheme: () => null,
})

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // A saved choice wins; on a first visit follow the operating system's theme
    if (typeof window === "undefined") return "dark"
    try {
      const saved = localStorage.getItem("theme")
      if (saved) return saved
    } catch { /* storage unavailable */ }
    return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark"
  })

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    try { localStorage.setItem("theme", theme) } catch { /* storage unavailable */ }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}