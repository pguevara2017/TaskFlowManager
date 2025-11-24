import { TextField, Select, MenuItem, FormControl, InputLabel, Box, InputAdornment } from "@mui/material";
import { Search } from "lucide-react";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedProject?: string;
  onProjectChange: (projectId: string) => void;
  projects: Array<{ id: string; name: string }>;
  selectedStatus?: string;
  onStatusChange: (status: string) => void;
  selectedPriority?: string;
  onPriorityChange: (priority: string) => void;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedProject,
  onProjectChange,
  projects,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
}: FilterBarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        alignItems: { xs: 'stretch', sm: 'center' },
      }}
    >
      <TextField
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
        sx={{ flex: 1, minWidth: 0 }}
        data-testid="input-search"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search className="h-4 w-4" />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Project</InputLabel>
          <Select
            value={selectedProject || 'all'}
            onChange={(e) => onProjectChange(e.target.value === 'all' ? undefined as unknown as string : e.target.value)}
            label="Project"
            data-testid="select-project"
          >
            <MenuItem value="all">All Projects</MenuItem>
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={selectedStatus || 'all'}
            onChange={(e) => onStatusChange(e.target.value === 'all' ? undefined as unknown as string : e.target.value)}
            label="Status"
            data-testid="select-status-filter"
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={selectedPriority || 'all'}
            onChange={(e) => onPriorityChange(e.target.value === 'all' ? undefined as unknown as string : e.target.value)}
            label="Priority"
            data-testid="select-priority-filter"
          >
            <MenuItem value="all">All Priority</MenuItem>
            <MenuItem value="1">Critical</MenuItem>
            <MenuItem value="2">High</MenuItem>
            <MenuItem value="3">Medium</MenuItem>
            <MenuItem value="4">Low</MenuItem>
            <MenuItem value="5">Lowest</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
