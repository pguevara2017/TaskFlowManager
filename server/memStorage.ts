import { type Project, type InsertProject, type Task, type InsertTask } from "@shared/schema";
import { randomUUID } from "crypto";
import { IStorage } from "./storage";

export class MemStorage implements IStorage {
  private projects: Map<string, Project>;
  private tasks: Map<string, Task>;

  constructor() {
    this.projects = new Map();
    this.tasks = new Map();
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      id,
      name: insertProject.name,
      description: insertProject.description ?? null,
      color: insertProject.color ?? "#3B82F6",
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, update: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updated: Project = {
      ...project,
      ...update,
    };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  async getTasks(filters?: {
    projectId?: string;
    status?: string;
    priority?: number;
    startDate?: Date;
    endDate?: Date;
    sortBy?: "priority" | "dueDate" | "name";
    sortOrder?: "asc" | "desc";
  }): Promise<Task[]> {
    let tasks = Array.from(this.tasks.values());

    if (filters) {
      if (filters.projectId) {
        tasks = tasks.filter((t) => t.projectId === filters.projectId);
      }
      if (filters.status) {
        tasks = tasks.filter((t) => t.status === filters.status);
      }
      if (filters.priority !== undefined) {
        tasks = tasks.filter((t) => t.priority === filters.priority);
      }
      if (filters.startDate) {
        tasks = tasks.filter((t) => {
          const taskDate = t.dueDate instanceof Date ? t.dueDate : new Date(t.dueDate);
          return taskDate >= filters.startDate!;
        });
      }
      if (filters.endDate) {
        tasks = tasks.filter((t) => {
          const taskDate = t.dueDate instanceof Date ? t.dueDate : new Date(t.dueDate);
          return taskDate <= filters.endDate!;
        });
      }

      if (filters.sortBy) {
        const order = filters.sortOrder === "desc" ? -1 : 1;
        tasks.sort((a: Task, b: Task) => {
          if (filters.sortBy === "priority") {
            return (a.priority - b.priority) * order;
          }
          if (filters.sortBy === "dueDate") {
            const aDate = a.dueDate instanceof Date ? a.dueDate : new Date(a.dueDate);
            const bDate = b.dueDate instanceof Date ? b.dueDate : new Date(b.dueDate);
            return (aDate.getTime() - bDate.getTime()) * order;
          }
          if (filters.sortBy === "name") {
            return a.name.localeCompare(b.name) * order;
          }
          return 0;
        });
      }
    }

    return tasks;
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const now = new Date();
    const task: Task = {
      id,
      projectId: insertTask.projectId,
      name: insertTask.name,
      description: insertTask.description ?? null,
      priority: insertTask.priority,
      dueDate: insertTask.dueDate instanceof Date ? insertTask.dueDate : new Date(insertTask.dueDate),
      assignee: insertTask.assignee,
      status: insertTask.status,
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, update: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    const normalized = { ...update };
    if (normalized.dueDate !== undefined) {
      normalized.dueDate = normalized.dueDate instanceof Date ? normalized.dueDate : new Date(normalized.dueDate);
    }

    const updated: Task = {
      ...task,
      ...normalized,
      updatedAt: new Date(),
    };
    this.tasks.set(id, updated);
    return updated;
  }

  async updateTaskStatus(id: string, status: "PENDING" | "IN_PROGRESS" | "COMPLETED"): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    const updated: Task = {
      ...task,
      status,
      updatedAt: new Date(),
    };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }
}
