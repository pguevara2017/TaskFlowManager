import { Card, CardContent, IconButton, Menu, MenuItem, Box, Typography, LinearProgress, useTheme } from "@mui/material";
import { MoreVertical, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";

interface ProjectCardProps {
  id: string;
  name: string;
  description?: string;
  color: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

export function ProjectCard({
  id,
  name,
  description,
  color,
  totalTasks,
  completedTasks,
  inProgressTasks,
  pendingTasks,
  onEdit,
  onDelete,
  onClick,
}: ProjectCardProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleMenuClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    onEdit?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    onDelete?.();
  };

  return (
    <Card
      onClick={onClick}
      data-testid={`card-project-${id}`}
      sx={{
        cursor: 'pointer',
        position: 'relative',
        '&::after': {
          content: '""',
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          zIndex: 1,
          transition: 'background-color 0.2s ease',
        },
        '&:hover::after': {
          backgroundColor: 'var(--elevate-1)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: color,
                mt: 0.5,
                flexShrink: 0,
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }} data-testid={`text-project-name-${id}`}>
                {name}
              </Typography>
              {description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {description}
                </Typography>
              )}
            </Box>
          </Box>
          <IconButton size="small" onClick={handleMenuClick} data-testid={`button-project-menu-${id}`}>
            <MoreVertical className="h-4 w-4" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleEdit} data-testid={`button-edit-project-${id}`}>
              Edit
            </MenuItem>
            <MenuItem onClick={handleDelete} data-testid={`button-delete-project-${id}`}>
              Delete
            </MenuItem>
          </Menu>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <CheckCircle2 className="h-4 w-4" style={{ color: theme.palette.success.main }} />
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }} data-testid={`text-completed-${id}`}>
              {completedTasks}
            </Typography>
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Clock className="h-4 w-4" style={{ color: theme.palette.primary.main }} />
              <Typography variant="body2" color="text.secondary">
                In Progress
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }} data-testid={`text-in-progress-${id}`}>
              {inProgressTasks}
            </Typography>
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <AlertCircle className="h-4 w-4" style={{ color: theme.palette.grey[500] }} />
              <Typography variant="body2" color="text.secondary">
                Pending
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }} data-testid={`text-pending-${id}`}>
              {pendingTasks}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Total Tasks
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }} data-testid={`text-total-${id}`}>
              {totalTasks}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
        </Box>
      </CardContent>
    </Card>
  );
}
