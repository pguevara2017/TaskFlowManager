import { CreateTaskDialog } from '../CreateTaskDialog';

export default function CreateTaskDialogExample() {
  return (
    <CreateTaskDialog
      projectId="project-1"
      onCreateTask={(task) => console.log('Task created:', task)}
    />
  );
}
