import { TaskCard } from '../TaskCard';

export default function TaskCardExample() {
  return (
    <div className="max-w-sm">
      <TaskCard
        id="1"
        name="Implement user authentication system"
        description="Create login and signup flows with JWT tokens"
        priority={2}
        dueDate={new Date(2024, 11, 20)}
        assignee="John Smith"
        status="IN_PROGRESS"
        onEdit={() => console.log('Edit clicked')}
        onDelete={() => console.log('Delete clicked')}
        onClick={() => console.log('Card clicked')}
      />
    </div>
  );
}
