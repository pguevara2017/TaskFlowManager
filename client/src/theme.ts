import { createTheme, ThemeOptions } from '@mui/material/styles';

// Helper function to convert HSL to hex color
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Convert current design system colors from HSL to MUI format
const colors = {
  primary: hslToHex(217, 91, 45),       // Blue from current design
  primaryLight: hslToHex(217, 91, 52),
  primaryDark: hslToHex(217, 91, 35),
  secondary: hslToHex(210, 8, 86),      // Light gray
  secondaryDark: hslToHex(210, 8, 20),
  error: hslToHex(0, 84, 48),           // Red/destructive
  errorDark: hslToHex(0, 84, 35),
  background: hslToHex(210, 5, 98),     // Light mode background
  backgroundDark: hslToHex(210, 5, 8),  // Dark mode background
  paper: hslToHex(210, 5, 96),          // Card background light
  paperDark: hslToHex(210, 5, 10),      // Card background dark
  text: hslToHex(210, 6, 12),           // Text light mode
  textDark: hslToHex(210, 5, 95),       // Text dark mode
  textSecondary: hslToHex(210, 6, 25),  // Muted text light
  textSecondaryDark: hslToHex(210, 5, 72), // Muted text dark
  divider: hslToHex(210, 5, 90),        // Border light
  dividerDark: hslToHex(210, 5, 18),    // Border dark
};

// Base theme options shared between light and dark modes
const getBaseTheme = (): ThemeOptions => ({
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8, // 0.5rem matches current design
  },
  spacing: 4, // 4px base spacing (0.25rem)
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '8px 16px',
          fontSize: '0.875rem',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        sizeMedium: {
          minHeight: 36,
        },
        sizeSmall: {
          minHeight: 32,
          padding: '6px 12px',
          fontSize: '0.75rem',
        },
        sizeLarge: {
          minHeight: 40,
          padding: '10px 32px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
          border: '1px solid',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid',
        },
      },
    },
  },
});

// Light theme
export const lightTheme = createTheme({
  ...getBaseTheme(),
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary,
      light: colors.primaryLight,
      dark: colors.primaryDark,
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.secondary,
      dark: colors.secondaryDark,
      contrastText: colors.text,
    },
    error: {
      main: colors.error,
      contrastText: '#ffffff',
    },
    background: {
      default: colors.background,
      paper: colors.paper,
    },
    text: {
      primary: colors.text,
      secondary: colors.textSecondary,
    },
    divider: colors.divider,
  },
  components: {
    ...getBaseTheme().components,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
          border: `1px solid ${colors.divider}`,
          backgroundColor: colors.paper,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${colors.divider}`,
          backgroundColor: hslToHex(210, 5, 94), // sidebar background
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${colors.divider}`,
        },
      },
    },
  },
});

// Dark theme
export const darkTheme = createTheme({
  ...getBaseTheme(),
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary,
      light: colors.primaryLight,
      dark: colors.primaryDark,
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.secondaryDark,
      contrastText: colors.textDark,
    },
    error: {
      main: colors.errorDark,
      contrastText: '#ffffff',
    },
    background: {
      default: colors.backgroundDark,
      paper: colors.paperDark,
    },
    text: {
      primary: colors.textDark,
      secondary: colors.textSecondaryDark,
    },
    divider: colors.dividerDark,
  },
  components: {
    ...getBaseTheme().components,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
          border: `1px solid ${colors.dividerDark}`,
          backgroundColor: colors.paperDark,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${colors.dividerDark}`,
          backgroundColor: hslToHex(210, 5, 12), // sidebar background dark
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${colors.dividerDark}`,
        },
      },
    },
  },
});
