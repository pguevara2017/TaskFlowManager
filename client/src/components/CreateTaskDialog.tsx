import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  IconButton,
} from "@mui/material";
import { Plus, X } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createTask, fetchProjects } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CreateTaskDialogProps {
  projectId?: string;
}

export function CreateTaskDialog({ projectId }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("3");
  const [assignee, setAssignee] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [dueDate, setDueDate] = useState<Date>();
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || "");
  const { toast } = useToast();

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    queryFn: () => fetchProjects(),
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects/stats"] });
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
      resetForm();
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setName("");
    setDescription("");
    setPriority("3");
    setAssignee("");
    setStatus("PENDING");
    setDueDate(undefined);
    if (!projectId) setSelectedProjectId("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProjectId) {
      toast({
        title: "Error",
        description: "Please select a project.",
        variant: "destructive",
      });
      return;
    }

    createTaskMutation.mutate({
      name,
      description: description || undefined,
      priority: parseInt(priority),
      assignee,
      status: status as "PENDING" | "IN_PROGRESS" | "COMPLETED",
      dueDate: dueDate ? dueDate.toISOString() : undefined,
      projectId: selectedProjectId,
    });
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Plus className="h-4 w-4" />}
        onClick={() => setOpen(true)}
        data-testid="button-create-task"
      >
        Create Task
      </Button>
      
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, pb: 1 }}>
          <DialogTitle sx={{ p: 0, fontSize: '1.25rem', fontWeight: 600 }}>
            Create New Task
          </DialogTitle>
          <IconButton onClick={() => setOpen(false)} size="small">
            <X className="h-5 w-5" />
          </IconButton>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Task Name"
              placeholder="Enter task name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              data-testid="input-task-name"
            />

            <TextField
              label="Description"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
              data-testid="input-task-description"
            />

            <FormControl fullWidth required>
              <InputLabel>Project</InputLabel>
              <Select
                value={selectedProjectId || ''}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                label="Project"
                disabled={projectsLoading}
                data-testid="select-project"
                displayEmpty
              >
                <MenuItem value="" disabled>
                  {projectsLoading ? 'Loading projects...' : 'Select a project'}
                </MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  label="Priority"
                  data-testid="select-priority"
                >
                  <MenuItem value="1">1 - Critical</MenuItem>
                  <MenuItem value="2">2 - High</MenuItem>
                  <MenuItem value="3">3 - Medium</MenuItem>
                  <MenuItem value="4">4 - Low</MenuItem>
                  <MenuItem value="5">5 - Lowest</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  label="Status"
                  data-testid="select-status"
                >
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Assignee"
                placeholder="Enter assignee name"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                required
                fullWidth
                data-testid="input-assignee"
              />

              <TextField
                label="Due Date (Optional)"
                type="date"
                value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setDueDate(value ? new Date(value) : undefined);
                }}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                data-testid="input-due-date"
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setOpen(false)}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createTaskMutation.isPending || projectsLoading}
              data-testid="button-submit"
            >
              {createTaskMutation.isPending ? "Creating..." : projectsLoading ? "Loading..." : "Create Task"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
