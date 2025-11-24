import { ProjectCard } from '@/components/ProjectCard';
import { TaskCard } from '@/components/TaskCard';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { Card, CardContent, Skeleton, Box, Typography } from '@mui/material';
import { CheckCircle2, Clock, AlertCircle, FolderKanban } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects, fetchTasks, fetchProjectStatsBulk } from '@/lib/api';
import { useTheme } from '@mui/material/styles';

export default function Dashboard() {
  const theme = useTheme();

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/tasks'],
    queryFn: () => fetchTasks(),
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: () => fetchProjects(),
  });

  const projectIds = projects.map((p) => p.id);

  const { data: statsMap = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/projects/stats', projectIds],
    queryFn: () => fetchProjectStatsBulk(projectIds),
    enabled: projects.length > 0,
  });

  const projectsWithStats = projects.map((project) => {
    const stats = statsMap[project.id] || {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      pendingTasks: 0,
    };
    return {
      ...project,
      description: project.description ?? undefined,
      ...stats,
    };
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const pendingTasks = tasks.filter((t) => t.status === 'PENDING').length;

  const isLoading = tasksLoading || projectsLoading || statsLoading;

  const statCards = [
    {
      title: 'Total Projects',
      value: projects.length,
      icon: FolderKanban,
      color: theme.palette.text.secondary,
      testId: 'text-total-projects',
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      color: theme.palette.success.main,
      testId: 'text-completed-tasks',
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: Clock,
      color: theme.palette.warning.main,
      testId: 'text-in-progress-tasks',
    },
    {
      title: 'Pending',
      value: pendingTasks,
      icon: AlertCircle,
      color: theme.palette.info.main,
      testId: 'text-pending-tasks',
    },
  ];

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
            data-testid="text-dashboard-title"
          >
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Overview of your projects and tasks
          </Typography>
        </Box>
        <CreateTaskDialog />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 2,
        }}
      >
        {statCards.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, fontSize: '0.875rem' }}
                  >
                    {stat.title}
                  </Typography>
                  <IconComponent size={16} color={stat.color} />
                </Box>
                {isLoading ? (
                  <Skeleton variant="text" width={64} height={32} />
                ) : (
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, fontSize: '1.5rem' }}
                    data-testid={stat.testId}
                  >
                    {stat.value}
                  </Typography>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Box>
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: 600, mb: 2 }}
          data-testid="text-projects-header"
        >
          Projects
        </Typography>
        {isLoading ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" height={192} />
            ))}
          </Box>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent sx={{ py: 3 }}>
              <Typography
                sx={{ textAlign: 'center', color: 'text.secondary' }}
              >
                No projects yet. Create your first project to get started.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {projectsWithStats.map((project) => (
              <ProjectCard
                key={project.id}
                {...project}
                onEdit={() => console.log('Edit project', project.id)}
                onDelete={() => console.log('Delete project', project.id)}
                onClick={() => console.log('View project', project.id)}
              />
            ))}
          </Box>
        )}
      </Box>

      <Box>
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: 600, mb: 2 }}
          data-testid="text-recent-tasks-header"
        >
          Recent Tasks
        </Typography>
        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" height={128} />
            ))}
          </Box>
        ) : tasks.length === 0 ? (
          <Card>
            <CardContent sx={{ py: 3 }}>
              <Typography
                sx={{ textAlign: 'center', color: 'text.secondary' }}
              >
                No tasks yet. Create your first task to get started.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {tasks.slice(0, 5).map((task) => (
              <TaskCard
                key={task.id}
                {...task}
                description={task.description ?? undefined}
                dueDate={new Date(task.dueDate)}
                status={task.status as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'}
                onEdit={() => console.log('Edit task', task.id)}
                onDelete={() => console.log('Delete task', task.id)}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
