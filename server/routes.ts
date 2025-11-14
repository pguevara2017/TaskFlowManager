import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { notificationService } from "./notificationService";
import { insertProjectSchema, insertTaskSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // ============ PROJECT ROUTES ============
  
  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Get single project
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // Create project
  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid project data", details: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  // Update project
  app.patch("/api/projects/:id", async (req, res) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Update data is required" });
      }
      
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, validatedData);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid project data", details: error.errors });
      }
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  // Delete project
  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // ============ TASK ROUTES ============

  // Get tasks with filtering and sorting
  app.get("/api/tasks", async (req, res) => {
    try {
      const filters: any = {};

      if (req.query.projectId) {
        filters.projectId = req.query.projectId as string;
      }
      
      if (req.query.status) {
        const status = req.query.status as string;
        if (!["PENDING", "IN_PROGRESS", "COMPLETED"].includes(status)) {
          return res.status(400).json({ error: "Invalid status value" });
        }
        filters.status = status;
      }
      
      if (req.query.priority) {
        const priority = parseInt(req.query.priority as string);
        if (isNaN(priority) || priority < 1 || priority > 5) {
          return res.status(400).json({ error: "Invalid priority value (must be 1-5)" });
        }
        filters.priority = priority;
      }
      
      if (req.query.startDate) {
        const startDate = new Date(req.query.startDate as string);
        if (isNaN(startDate.getTime())) {
          return res.status(400).json({ error: "Invalid startDate format" });
        }
        filters.startDate = startDate;
      }
      
      if (req.query.endDate) {
        const endDate = new Date(req.query.endDate as string);
        if (isNaN(endDate.getTime())) {
          return res.status(400).json({ error: "Invalid endDate format" });
        }
        filters.endDate = endDate;
      }
      
      if (req.query.sortBy) {
        const sortBy = req.query.sortBy as string;
        if (!["priority", "dueDate", "name"].includes(sortBy)) {
          return res.status(400).json({ error: "Invalid sortBy value (must be priority, dueDate, or name)" });
        }
        filters.sortBy = sortBy as "priority" | "dueDate" | "name";
      }
      
      if (req.query.sortOrder) {
        const sortOrder = req.query.sortOrder as string;
        if (!["asc", "desc"].includes(sortOrder)) {
          return res.status(400).json({ error: "Invalid sortOrder value (must be asc or desc)" });
        }
        filters.sortOrder = sortOrder as "asc" | "desc";
      }

      const tasks = await storage.getTasks(filters);

      let result = tasks;
      if (req.query.page && req.query.limit) {
        const page = parseInt(req.query.page as string);
        const limit = parseInt(req.query.limit as string);
        
        if (isNaN(page) || page < 1) {
          return res.status(400).json({ error: "Invalid page value (must be >= 1)" });
        }
        if (isNaN(limit) || limit < 1) {
          return res.status(400).json({ error: "Invalid limit value (must be >= 1)" });
        }
        
        const start = (page - 1) * limit;
        const end = start + limit;
        result = tasks.slice(start, end);
      }

      res.json({
        tasks: result,
        total: tasks.length,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  // Get single task
  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.getTask(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Error fetching task:", error);
      res.status(500).json({ error: "Failed to fetch task" });
    }
  });

  // Create task with email notification
  app.post("/api/tasks", async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);

      notificationService.sendTaskCreatedNotification(task).catch((error) => {
        console.error("Failed to send task created notification:", error);
      });

      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid task data", details: error.errors });
      }
      console.error("Error creating task:", error);
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  // Update task with email notification
  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Update data is required" });
      }
      
      const validatedData = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(req.params.id, validatedData);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      notificationService.sendTaskUpdatedNotification(task).catch((error) => {
        console.error("Failed to send task updated notification:", error);
      });

      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid task data", details: error.errors });
      }
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  // Update task status (thread-safe)
  app.patch("/api/tasks/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!["PENDING", "IN_PROGRESS", "COMPLETED"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }

      const task = await storage.updateTaskStatus(req.params.id, status);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      notificationService.sendTaskUpdatedNotification(task).catch((error) => {
        console.error("Failed to send task updated notification:", error);
      });

      res.json(task);
    } catch (error) {
      console.error("Error updating task status:", error);
      res.status(500).json({ error: "Failed to update task status" });
    }
  });

  // Delete task
  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTask(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // Get batched project statistics
  app.get("/api/projects/stats", async (req, res) => {
    try {
      const projectIds = req.query.ids ? (req.query.ids as string).split(',') : undefined;
      const stats = await storage.getProjectStatsBulk(projectIds);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching project stats:", error);
      res.status(500).json({ error: "Failed to fetch project statistics" });
    }
  });

  // Get project statistics
  app.get("/api/projects/:id/stats", async (req, res) => {
    try {
      const tasks = await storage.getTasks({ projectId: req.params.id });
      
      const stats = {
        totalTasks: tasks.length,
        completedTasks: tasks.filter((t: any) => t.status === "COMPLETED").length,
        inProgressTasks: tasks.filter((t: any) => t.status === "IN_PROGRESS").length,
        pendingTasks: tasks.filter((t: any) => t.status === "PENDING").length,
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching project stats:", error);
      res.status(500).json({ error: "Failed to fetch project statistics" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
