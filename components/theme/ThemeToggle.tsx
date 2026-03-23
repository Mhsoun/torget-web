"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

interface ThemeToggleProps {
  /** Additional class names */
  className?: string;
}

/**
 * A button that toggles between light and dark mode.
 * Uses Sun / Moon icons from Lucide. Consumes only semantic tokens.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { isDark, toggleMode } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={toggleMode}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4" aria-hidden />
      ) : (
        <Moon className="h-4 w-4" aria-hidden />
      )}
    </Button>
  );
}
