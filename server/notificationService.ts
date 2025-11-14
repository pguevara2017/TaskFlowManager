import { Worker } from "worker_threads";
import { Task } from "@shared/schema";

interface NotificationJob {
  type: "task_created" | "task_updated";
  taskId: string;
  taskName: string;
  assignee: string;
  priority: number;
  dueDate: Date;
  status?: string;
}

interface WorkerInfo {
  worker: Worker;
  busy: boolean;
}

const POOL_SIZE = 4;

const workerCode = `
const { parentPort } = require("worker_threads");

if (parentPort) {
  parentPort.on("message", (notification) => {
    try {
      console.log("\\n=== EMAIL NOTIFICATION (Worker Thread) ===");
      console.log(\`Type: \${notification.type.toUpperCase().replace("_", " ")}\`);
      console.log(\`To: \${notification.assignee}\`);
      console.log(\`Subject: Task \${notification.type === "task_created" ? "Assigned" : "Updated"}: \${notification.taskName}\`);
      console.log(\`Task ID: \${notification.taskId}\`);
      console.log(\`Priority: \${notification.priority}\`);
      console.log(\`Due Date: \${new Date(notification.dueDate).toLocaleDateString()}\`);
      if (notification.status) {
        console.log(\`Status: \${notification.status}\`);
      }
      console.log(\`Message: You have been \${notification.type === "task_created" ? "assigned to" : "notified of an update to"} the task "\${notification.taskName}"\`);
      console.log("==========================================\\n");
      
      parentPort.postMessage({ success: true });
    } catch (error) {
      console.error("Error in email worker:", error);
      parentPort.postMessage({ success: false, error: String(error) });
    }
  });

  parentPort.postMessage({ ready: true });
}
`;

export class NotificationService {
  private static instance: NotificationService;
  private workerPool: WorkerInfo[] = [];
  private jobQueue: { job: NotificationJob; resolve: () => void; reject: (error: Error) => void }[] = [];

  private constructor() {
    this.initializeWorkerPool();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private createWorker(id: number): WorkerInfo | null {
    try {
      const worker = new Worker(workerCode, { eval: true });

      const workerInfo: WorkerInfo = {
        worker,
        busy: false,
      };

      worker.on("message", (message) => {
        if (message.ready) {
          return;
        }
        
        workerInfo.busy = false;
        this.processQueue();
      });

      worker.on("error", (error) => {
        console.error(`Worker ${id} error:`, error);
        workerInfo.busy = false;
        this.processQueue();
      });

      worker.on("exit", (code) => {
        if (code !== 0) {
          console.error(`Worker ${id} exited with code ${code}, recreating...`);
          const index = this.workerPool.indexOf(workerInfo);
          if (index !== -1) {
            this.workerPool.splice(index, 1);
            const newWorker = this.createWorker(id);
            if (newWorker) {
              this.workerPool.push(newWorker);
            }
          }
        }
      });

      return workerInfo;
    } catch (error) {
      console.error(`Failed to create worker ${id}:`, error);
      return null;
    }
  }

  private initializeWorkerPool(): void {
    for (let i = 0; i < POOL_SIZE; i++) {
      const workerInfo = this.createWorker(i);
      if (workerInfo) {
        this.workerPool.push(workerInfo);
      }
    }

    console.log(`✓ Email notification worker pool initialized with ${this.workerPool.length}/${POOL_SIZE} workers`);
  }

  public async sendTaskCreatedNotification(task: Task): Promise<void> {
    return this.enqueueNotification({
      type: "task_created",
      taskId: task.id,
      taskName: task.name,
      assignee: task.assignee,
      priority: task.priority,
      dueDate: task.dueDate,
    });
  }

  public async sendTaskUpdatedNotification(task: Task): Promise<void> {
    return this.enqueueNotification({
      type: "task_updated",
      taskId: task.id,
      taskName: task.name,
      assignee: task.assignee,
      priority: task.priority,
      dueDate: task.dueDate,
      status: task.status,
    });
  }

  private async enqueueNotification(notification: NotificationJob): Promise<void> {
    if (this.workerPool.length === 0) {
      console.warn("No workers available, logging notification directly");
      console.log("\n=== EMAIL NOTIFICATION (Fallback) ===");
      console.log(`Type: ${notification.type}, Task: ${notification.taskName}, Assignee: ${notification.assignee}`);
      console.log("====================================\n");
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.jobQueue.push({ job: notification, resolve, reject });
      this.processQueue();
    });
  }

  private processQueue(): void {
    if (this.jobQueue.length === 0) {
      return;
    }

    const availableWorker = this.workerPool.find((w) => !w.busy);
    if (!availableWorker) {
      return;
    }

    const queueItem = this.jobQueue.shift();
    if (!queueItem) {
      return;
    }

    availableWorker.busy = true;

    try {
      availableWorker.worker.postMessage(queueItem.job);
      
      const timeout = setTimeout(() => {
        availableWorker.busy = false;
        queueItem.resolve();
        this.processQueue();
      }, 5000);

      availableWorker.worker.once("message", () => {
        clearTimeout(timeout);
        queueItem.resolve();
      });
    } catch (error) {
      console.error("Error sending message to worker:", error);
      availableWorker.busy = false;
      queueItem.reject(error as Error);
      this.processQueue();
    }
  }

  public shutdown(): void {
    this.workerPool.forEach(({ worker }) => {
      worker.terminate();
    });
    this.workerPool = [];
    console.log("Email notification service shut down");
  }
}

export const notificationService = NotificationService.getInstance();
