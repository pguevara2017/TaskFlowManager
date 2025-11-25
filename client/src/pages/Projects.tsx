import { useState } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { CreateProjectDialog } from '@/components/CreateProjectDialog';
import { TextField, Skeleton, Card, CardContent, Box, InputAdornment } from '@mui/material';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects, fetchProjectStatsBulk } from '@/lib/api';

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('');

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

  const isLoading = projectsLoading || statsLoading;

  const filteredProjects = projectsWithStats.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Box
            component="h1"
            sx={{ fontSize: '1.875rem', fontWeight: 600, mb: 0.5 }}
            data-testid="text-projects-title"
          >
            Projects
          </Box>
          <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            Manage and track all your projects
          </Box>
        </Box>
        <CreateProjectDialog />
      </Box>

      <TextField
        placeholder="Search projects..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="small"
        sx={{ maxWidth: 448 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={16} />
            </InputAdornment>
          ),
        }}
        inputProps={{ 'data-testid': 'input-search-projects' } as any}
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
            gap: 3,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} variant="rectangular" height={192} />
          ))}
        </Box>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <CardContent sx={{ pt: 3 }}>
            <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
              {searchQuery
                ? 'No projects found matching your search'
                : 'No projects yet. Create your first project to get started.'}
            </Box>
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
          {filteredProjects.map((project) => (
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
  );
}
