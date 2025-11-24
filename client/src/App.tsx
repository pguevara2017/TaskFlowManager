import { useState, useMemo, useEffect } from 'react';
import { Switch, Route } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  IconButton,
  Toolbar,
  useMediaQuery,
} from '@mui/material';
import { Menu as MenuIcon } from 'lucide-react';
import { lightTheme, darkTheme } from './theme';
import { AppSidebar } from '@/components/app-sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import Dashboard from '@/pages/Dashboard';
import Projects from '@/pages/Projects';
import Tasks from '@/pages/Tasks';
import CalendarView from '@/pages/CalendarView';
import NotFound from '@/pages/not-found';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/projects" component={Projects} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/calendar" component={CalendarView} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Theme state - syncs with localStorage and system preference
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('theme-mode');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  const theme = useMemo(
    () => (mode === 'dark' ? darkTheme : lightTheme),
    [mode]
  );

  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  // Sync Tailwind dark mode class with MUI theme on mount and mode changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <Box sx={{ display: 'flex', height: '100vh' }}>
          <AppSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <Toolbar
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'background.default',
                justifyContent: 'space-between',
                px: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {!isDesktop && (
                  <IconButton
                    edge="start"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    data-testid="button-sidebar-toggle"
                    sx={{ mr: 2 }}
                  >
                    <MenuIcon size={20} />
                  </IconButton>
                )}
              </Box>
              <ThemeToggle toggleTheme={toggleTheme} mode={mode} />
            </Toolbar>
            <Box
              sx={{
                flexGrow: 1,
                overflow: 'auto',
                p: { xs: 3, md: 4 },
              }}
            >
              <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
                <Router />
              </Box>
            </Box>
          </Box>
        </Box>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
