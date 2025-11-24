import { Moon, Sun } from "lucide-react";
import { IconButton } from "@mui/material";

interface ThemeToggleProps {
  toggleTheme: () => void;
  mode: 'light' | 'dark';
}

export function ThemeToggle({ toggleTheme, mode }: ThemeToggleProps) {
  return (
    <IconButton
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
      sx={{ color: 'text.primary' }}
    >
      {mode === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </IconButton>
  );
}
