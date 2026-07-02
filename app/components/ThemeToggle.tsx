import { useTheme } from "~/lib/theme";

/**
 * Day/night control, spoken in the site's mono voice.
 * Shows the world you would switch TO.
 */
export function ThemeToggle() {
  const [theme, toggle] = useTheme();
  const next = theme === "dark" ? "day" : "night";
  return (
    <button
      className="mono theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      [{next}]
    </button>
  );
}
