import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Avatar,
  IconButton,
  TableSortLabel,
  Box,
} from '@mui/material';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';
import { useTheme } from '@mui/material/styles';

interface Task {
  id: string;
  name: string;
  priority: number;
  dueDate: Date;
  assignee: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

interface TaskTableProps {
  tasks: Task[];
  selectedTasks: string[];
  onSelectTask: (taskId: string) => void;
  onSelectAll: () => void;
  onSort: (field: string) => void;
  sortBy?: string;
  onTaskClick?: (task: Task) => void;
}

export function TaskTable({
  tasks,
  selectedTasks,
  onSelectTask,
  onSelectAll,
  onSort,
  sortBy,
  onTaskClick,
}: TaskTableProps) {
  const theme = useTheme();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (tasks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 12 }}>
        <Box sx={{ color: 'text.secondary' }}>No tasks found</Box>
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={selectedTasks.length === tasks.length && tasks.length > 0}
                indeterminate={
                  selectedTasks.length > 0 && selectedTasks.length < tasks.length
                }
                onChange={onSelectAll}
                inputProps={{ 'data-testid': 'checkbox-select-all' } as any}
              />
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'name'}
                onClick={() => onSort('name')}
                data-testid="button-sort-name"
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'priority'}
                onClick={() => onSort('priority')}
                data-testid="button-sort-priority"
              >
                Priority
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'dueDate'}
                onClick={() => onSort('dueDate')}
                data-testid="button-sort-due-date"
              >
                Due Date
              </TableSortLabel>
            </TableCell>
            <TableCell>Assignee</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.id}
              hover
              onClick={() => onTaskClick?.(task)}
              sx={{
                cursor: onTaskClick ? 'pointer' : 'default',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'var(--elevate-1)',
                  opacity: 0,
                  pointerEvents: 'none',
                  transition: 'opacity 0.2s',
                },
                '&:hover::after': {
                  opacity: 1,
                },
              }}
              data-testid={`row-task-${task.id}`}
            >
              <TableCell
                padding="checkbox"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={selectedTasks.includes(task.id)}
                  onChange={() => onSelectTask(task.id)}
                  inputProps={{ 'data-testid': `checkbox-task-${task.id}` } as any}
                />
              </TableCell>
              <TableCell
                sx={{ fontWeight: 500 }}
                data-testid={`text-task-name-${task.id}`}
              >
                {task.name}
              </TableCell>
              <TableCell>
                <PriorityBadge priority={task.priority} />
              </TableCell>
              <TableCell data-testid={`text-due-date-${task.id}`}>
                {format(task.dueDate, 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: '0.75rem',
                      bgcolor: theme.palette.primary.main,
                    }}
                  >
                    {getInitials(task.assignee)}
                  </Avatar>
                  <Box component="span" sx={{ fontSize: '0.875rem' }}>
                    {task.assignee}
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <StatusBadge status={task.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
