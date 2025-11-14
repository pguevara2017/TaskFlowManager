import { ProjectCard } from "@/components/ProjectCard";
import { useQuery } from "@tanstack/react-query";
import { fetchProjectStats } from "@/lib/api";
import type { Project } from "@shared/schema";

interface ProjectCardWithStatsProps {
  project: Project;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

export function ProjectCardWithStats({
  project,
  onEdit,
  onDelete,
  onClick,
}: ProjectCardWithStatsProps) {
  const { data: stats } = useQuery({
    queryKey: ["/api/projects", project.id, "stats"],
    queryFn: () => fetchProjectStats(project.id),
  });

  return (
    <ProjectCard
      {...project}
      description={project.description ?? undefined}
      totalTasks={stats?.totalTasks ?? 0}
      completedTasks={stats?.completedTasks ?? 0}
      inProgressTasks={stats?.inProgressTasks ?? 0}
      pendingTasks={stats?.pendingTasks ?? 0}
      onEdit={onEdit}
      onDelete={onDelete}
      onClick={onClick}
    />
  );
}
