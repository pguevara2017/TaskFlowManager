import { ProjectCard } from '../ProjectCard';

export default function ProjectCardExample() {
  return (
    <div className="max-w-md">
      <ProjectCard
        id="1"
        name="Website Redesign"
        description="Complete overhaul of company website with new branding and features"
        color="#3B82F6"
        totalTasks={24}
        completedTasks={12}
        inProgressTasks={8}
        pendingTasks={4}
        onEdit={() => console.log('Edit clicked')}
        onDelete={() => console.log('Delete clicked')}
        onClick={() => console.log('Card clicked')}
      />
    </div>
  );
}
