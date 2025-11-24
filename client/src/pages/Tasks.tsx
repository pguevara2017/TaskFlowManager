import { useState } from 'react';
import { TaskTable } from '@/components/TaskTable';
import { TaskCard } from '@/components/TaskCard';
import { FilterBar } from '@/components/FilterBar';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Skeleton,
  Card,
  CardContent,
} from '@mui/material';
import { LayoutGrid, List } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects, fetchTasks } from '@/lib/api';

export default function Tasks() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('dueDate');

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: () => fetchProjects(),
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: [
      '/api/tasks',
      {
        projectId: selectedProject === 'all' ? undefined : selectedProject,
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        priority:
          selectedPriority === 'all' ? undefined : parseInt(selectedPriority),
        sortBy:
          sortBy === 'dueDate'
            ? 'dueDate'
            : sortBy === 'priority'
            ? 'priority'
            : 'name',
        sortOrder: 'asc',
      },
    ],
    queryFn: () =>
      fetchTasks({
        projectId: selectedProject === 'all' ? undefined : selectedProject,
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        priority:
          selectedPriority === 'all' ? undefined : parseInt(selectedPriority),
        sortBy:
          sortBy === 'dueDate'
            ? 'dueDate'
            : sortBy === 'priority'
            ? 'priority'
            : 'name',
        sortOrder: 'asc',
      }),
  });

  const projectOptions = projects.map((p) => ({ id: p.id, name: p.name }));

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch =
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .map((task) => ({
      ...task,
      description: task.description ?? undefined,
      dueDate: new Date(task.dueDate),
      status: task.status as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED',
    }));

  const isLoading = tasksLoading || projectsLoading;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 600, mb: 0.5 }}
            data-testid="text-tasks-title"
          >
            Tasks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage all your tasks
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, newView) => newView && setView(newView)}
            size="small"
          >
            <ToggleButton value="grid" data-testid="button-view-grid">
              <LayoutGrid size={16} />
            </ToggleButton>
            <ToggleButton value="list" data-testid="button-view-list">
              <List size={16} />
            </ToggleButton>
          </ToggleButtonGroup>
          <CreateTaskDialog />
        </Box>
      </Box>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
        projects={projectOptions}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
      />

      {isLoading ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: 2,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} variant="rectangular" height={192} />
          ))}
        </Box>
      ) : filteredTasks.length === 0 ? (
        <Card>
          <CardContent sx={{ py: 3 }}>
            <Typography
              sx={{ textAlign: 'center', color: 'text.secondary' }}
            >
              {searchQuery ||
              selectedProject !== 'all' ||
              selectedStatus !== 'all' ||
              selectedPriority !== 'all'
                ? 'No tasks found matching your filters'
                : 'No tasks yet. Create your first task to get started.'}
            </Typography>
          </CardContent>
        </Card>
      ) : view === 'grid' ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: 2,
          }}
        >
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              {...task}
              onEdit={() => console.log('Edit task', task.id)}
              onDelete={() => console.log('Delete task', task.id)}
              onClick={() => console.log('View task', task.id)}
            />
          ))}
        </Box>
      ) : (
        <TaskTable
          tasks={filteredTasks}
          selectedTasks={selectedTasks}
          onSelectTask={(id) => {
            setSelectedTasks((prev) =>
              prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
            );
          }}
          onSelectAll={() => {
            setSelectedTasks(
              selectedTasks.length === filteredTasks.length
                ? []
                : filteredTasks.map((t) => t.id)
            );
          }}
          onSort={(field) => {
            console.log('Sort by:', field);
            setSortBy(field);
          }}
          sortBy={sortBy}
          onTaskClick={(task) => console.log('Clicked task:', task)}
        />
      )}
    </Box>
  );
}
