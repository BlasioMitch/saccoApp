import Switch from "./switch"
import { useTheme } from "./ThemeProvider"
import { Moon, Sun } from "lucide-react"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-2 px-1">
      <Sun className="h-4 w-4 text-custom-text-secondary shrink-0" />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="shrink-0"
      />
      <Moon className="h-4 w-4 text-custom-text-secondary shrink-0" />
    </div>
  )
}