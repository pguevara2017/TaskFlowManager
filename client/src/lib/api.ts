import type { Project, Task, InsertProject, InsertTask } from "@shared/schema";

const API_BASE = "";

export async function fetchProjects(): Promise<Project[]> {
  const response = await fetch(`${API_BASE}/api/projects`);
  if (!response.ok) throw new Error("Failed to fetch projects");
  return response.json();
}

export async function fetchProject(id: string): Promise<Project> {
  const response = await fetch(`${API_BASE}/api/projects/${id}`);
  if (!response.ok) throw new Error("Failed to fetch project");
  return response.json();
}

export async function createProject(data: InsertProject): Promise<Project> {
  const response = await fetch(`${API_BASE}/api/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create project");
  return response.json();
}

export async function updateProject(id: string, data: Partial<InsertProject>): Promise<Project> {
  const response = await fetch(`${API_BASE}/api/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update project");
  return response.json();
}

export async function deleteProject(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/projects/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete project");
}

export async function fetchProjectStats(id: string): Promise<{
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
}> {
  const response = await fetch(`${API_BASE}/api/projects/${id}/stats`);
  if (!response.ok) throw new Error("Failed to fetch project stats");
  return response.json();
}

export async function fetchProjectStatsBulk(projectIds?: string[]): Promise<Record<string, {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
}>> {
  const url = projectIds
    ? `${API_BASE}/api/projects/stats?ids=${projectIds.join(",")}`
    : `${API_BASE}/api/projects/stats`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch project stats");
  return response.json();
}

export async function fetchTasks(filters?: {
  projectId?: string;
  status?: string;
  priority?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}): Promise<Task[]> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }
  
  const url = `${API_BASE}/api/tasks${params.toString() ? `?${params.toString()}` : ""}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch tasks");
  const data = await response.json();
  return data.tasks || [];
}

export async function fetchTask(id: string): Promise<Task> {
  const response = await fetch(`${API_BASE}/api/tasks/${id}`);
  if (!response.ok) throw new Error("Failed to fetch task");
  return response.json();
}

export async function createTask(data: InsertTask): Promise<Task> {
  const response = await fetch(`${API_BASE}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create task");
  return response.json();
}

export async function updateTask(id: string, data: Partial<InsertTask>): Promise<Task> {
  const response = await fetch(`${API_BASE}/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update task");
  return response.json();
}

export async function updateTaskStatus(
  id: string,
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED"
): Promise<Task> {
  const response = await fetch(`${API_BASE}/api/tasks/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to update task status");
  return response.json();
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/tasks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete task");
}
