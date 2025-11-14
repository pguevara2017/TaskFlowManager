import { type Project, type InsertProject, type Task, type InsertTask, projects, tasks } from "@shared/schema";
import { getDb } from "../db/index";
import { eq, and, gte, lte, sql, inArray } from "drizzle-orm";

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
}

export interface IStorage {
  // Project methods
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  getProjectStatsBulk(projectIds?: string[]): Promise<Record<string, ProjectStats>>;

  // Task methods
  getTasks(filters?: {
    projectId?: string;
    status?: string;
    priority?: number;
    startDate?: Date;
    endDate?: Date;
    sortBy?: "priority" | "dueDate" | "name";
    sortOrder?: "asc" | "desc";
  }): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  updateTaskStatus(id: string, status: "PENDING" | "IN_PROGRESS" | "COMPLETED"): Promise<Task | undefined>;
}

export class DbStorage implements IStorage {
  private get db() {
    return getDb();
  }

  async getProjects(): Promise<Project[]> {
    return await this.db.select().from(projects);
  }

  async getProject(id: string): Promise<Project | undefined> {
    const result = await this.db.select().from(projects).where(eq(projects.id, id));
    return result[0];
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const result = await this.db.insert(projects).values(insertProject).returning();
    return result[0];
  }

  async updateProject(id: string, update: Partial<InsertProject>): Promise<Project | undefined> {
    const result = await this.db
      .update(projects)
      .set(update)
      .where(eq(projects.id, id))
      .returning();
    return result[0];
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await this.db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }

  async getProjectStatsBulk(projectIds?: string[]): Promise<Record<string, ProjectStats>> {
    const allProjects = projectIds && projectIds.length > 0
      ? await this.db.select().from(projects).where(inArray(projects.id, projectIds))
      : await this.db.select().from(projects);
    
    const allTasks = await this.db.select().from(tasks);

    const stats: Record<string, ProjectStats> = {};
    
    for (const project of allProjects) {
      const projectTasks = allTasks.filter(t => t.projectId === project.id);
      stats[project.id] = {
        totalTasks: projectTasks.length,
        completedTasks: projectTasks.filter(t => t.status === "COMPLETED").length,
        inProgressTasks: projectTasks.filter(t => t.status === "IN_PROGRESS").length,
        pendingTasks: projectTasks.filter(t => t.status === "PENDING").length,
      };
    }

    return stats;
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
    let query = this.db.select().from(tasks);

    const conditions = [];
    if (filters?.projectId) {
      conditions.push(eq(tasks.projectId, filters.projectId));
    }
    if (filters?.status) {
      conditions.push(eq(tasks.status, filters.status));
    }
    if (filters?.priority !== undefined) {
      conditions.push(eq(tasks.priority, filters.priority));
    }
    if (filters?.startDate) {
      conditions.push(gte(tasks.dueDate, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(tasks.dueDate, filters.endDate));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    let result = await query;

    if (filters?.sortBy) {
      const order = filters.sortOrder === "desc" ? -1 : 1;
      result.sort((a: Task, b: Task) => {
        if (filters.sortBy === "priority") {
          return (a.priority - b.priority) * order;
        }
        if (filters.sortBy === "dueDate") {
          return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * order;
        }
        if (filters.sortBy === "name") {
          return a.name.localeCompare(b.name) * order;
        }
        return 0;
      });
    }

    return result;
  }

  async getTask(id: string): Promise<Task | undefined> {
    const result = await this.db.select().from(tasks).where(eq(tasks.id, id));
    return result[0];
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const result = await this.db.insert(tasks).values(insertTask).returning();
    return result[0];
  }

  async updateTask(id: string, update: Partial<InsertTask>): Promise<Task | undefined> {
    const result = await this.db
      .update(tasks)
      .set({ ...update, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return result[0];
  }

  async updateTaskStatus(id: string, status: "PENDING" | "IN_PROGRESS" | "COMPLETED"): Promise<Task | undefined> {
    const result = await this.db
      .update(tasks)
      .set({ status, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return result[0];
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await this.db.delete(tasks).where(eq(tasks.id, id)).returning();
    return result.length > 0;
  }
}

import { MemStorage } from "./memStorage";

export const storage = process.env.DATABASE_URL ? new DbStorage() : new MemStorage();
