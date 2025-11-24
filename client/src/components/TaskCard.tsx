import { Card, CardContent, Avatar, IconButton, Menu, MenuItem, Box, Typography, useTheme } from "@mui/material";
import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";
import { Calendar, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface TaskCardProps {
  id: string;
  name: string;
  description?: string;
  priority: number;
  dueDate: Date;
  assignee: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

export function TaskCard({
  id,
  name,
  description,
  priority,
  dueDate,
  assignee,
  status,
  onEdit,
  onDelete,
  onClick,
}: TaskCardProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = () => {
    if (status === "COMPLETED") return theme.palette.success.main;
    if (status === "IN_PROGRESS") return theme.palette.primary.main;
    return theme.palette.grey[500];
  };

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
      data-testid={`card-task-${id}`}
      sx={{
        minHeight: 120,
        cursor: 'pointer',
        borderLeft: `4px solid ${getStatusColor()}`,
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
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, flex: 1, pr: 1 }} data-testid={`text-task-name-${id}`}>
            {name}
          </Typography>
          <IconButton size="small" onClick={handleMenuClick} data-testid={`button-task-menu-${id}`}>
            <MoreVertical className="h-4 w-4" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleEdit} data-testid={`button-edit-task-${id}`}>
              Edit
            </MenuItem>
            <MenuItem onClick={handleDelete} data-testid={`button-delete-task-${id}`}>
              Delete
            </MenuItem>
          </Menu>
        </Box>
        
        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
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
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PriorityBadge priority={priority} />
            <StatusBadge status={status} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Calendar className="h-4 w-4" style={{ color: 'var(--mui-palette-text-secondary)' }} />
              <Typography variant="body2" color="text.secondary" data-testid={`text-due-date-${id}`}>
                {format(dueDate, "MMM d")}
              </Typography>
            </Box>
            <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem' }}>
              {getInitials(assignee)}
            </Avatar>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
