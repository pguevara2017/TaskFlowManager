import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Paper,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { format, isSameDay } from 'date-fns';
import { PriorityBadge } from './PriorityBadge';
import { useTheme } from '@mui/material/styles';

interface Task {
  id: string;
  name: string;
  priority: number;
  dueDate: Date;
  assignee: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

interface TaskCalendarProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

function ServerDay(
  props: PickersDayProps & { hasTasksOnDate?: boolean }
) {
  const { hasTasksOnDate, day, ...other } = props;

  return (
    <Box sx={{ position: 'relative' }}>
      <PickersDay
        {...other}
        day={day}
        sx={{
          ...(hasTasksOnDate && {
            fontWeight: 'bold',
            borderBottom: '2px solid',
            borderBottomColor: 'primary.main',
          }),
        }}
      />
    </Box>
  );
}

export function TaskCalendar({ tasks, onTaskClick }: TaskCalendarProps) {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // Normalize tasks to ensure dueDate is always a Date object
  const normalizedTasks = tasks.map((task) => ({
    ...task,
    dueDate:
      task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate),
  }));

  const getTasksForDate = (date: Date) => {
    return normalizedTasks.filter((task) => isSameDay(task.dueDate, date));
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const hasTasksOnDate = (date: Date) => {
    return normalizedTasks.some((task) => isSameDay(task.dueDate, date));
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' },
        gap: 3,
      }}
    >
      <Box sx={{ gridColumn: { xs: 'span 1', lg: 'span 2' } }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Calendar View
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                slots={{
                  day: ServerDay,
                }}
                slotProps={{
                  day: (ownerState) =>
                    ({
                      hasTasksOnDate: hasTasksOnDate(ownerState.day),
                    } as any),
                }}
                sx={{
                  width: '100%',
                  '& .MuiPickersCalendarHeader-root': {
                    paddingLeft: 1,
                    paddingRight: 1,
                  },
                }}
              />
            </LocalizationProvider>
          </CardContent>
        </Card>
      </Box>

      <Box>
        <Card>
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {selectedDate
                  ? format(selectedDate, 'MMMM d, yyyy')
                  : 'Select a date'}
              </Typography>
              {selectedDateTasks.length > 0 && (
                <Chip
                  label={`${selectedDateTasks.length} ${
                    selectedDateTasks.length === 1 ? 'task' : 'tasks'
                  }`}
                  size="small"
                  color="default"
                />
              )}
            </Box>
            {selectedDateTasks.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No tasks due on this date
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {selectedDateTasks.map((task) => (
                  <Paper
                    key={task.id}
                    onClick={() => onTaskClick?.(task)}
                    data-testid={`calendar-task-${task.id}`}
                    sx={{
                      p: 1.5,
                      cursor: 'pointer',
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
                        transition: 'opacity 0.2s',
                        pointerEvents: 'none',
                        borderRadius: 'inherit',
                      },
                      '&:hover::after': {
                        opacity: 1,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {task.name}
                      </Typography>
                      <PriorityBadge priority={task.priority} />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Assigned to: {task.assignee}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
