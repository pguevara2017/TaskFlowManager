import {
  Home,
  FolderKanban,
  Calendar,
  CheckSquare,
  LayoutDashboard,
} from 'lucide-react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link, useLocation } from 'wouter';

const items = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Projects',
    url: '/projects',
    icon: FolderKanban,
  },
  {
    title: 'Tasks',
    url: '/tasks',
    icon: CheckSquare,
  },
  {
    title: 'Calendar',
    url: '/calendar',
    icon: Calendar,
  },
];

const DRAWER_WIDTH = 240;

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const [location] = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Drawer
      variant={isDesktop ? 'permanent' : 'temporary'}
      open={isDesktop ? true : open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckSquare size={20} color={theme.palette.primary.contrastText} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            TaskFlow
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: 1 }}>
        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 1,
            display: 'block',
            color: 'text.secondary',
            fontWeight: 500,
            textTransform: 'uppercase',
            fontSize: '0.75rem',
          }}
        >
          Navigation
        </Typography>
        <List>
          {items.map((item) => {
            const IconComponent = item.icon;
            const isActive = location === item.url;

            return (
              <ListItem key={item.title} disablePadding>
                <Link href={item.url}>
                  <ListItemButton
                    data-testid={`link-${item.title.toLowerCase()}`}
                    selected={isActive}
                    onClick={() => !isDesktop && onClose()}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      '&.Mui-selected': {
                        bgcolor: 'action.selected',
                        '&:hover': {
                          bgcolor: 'action.selected',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <IconComponent size={20} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}
