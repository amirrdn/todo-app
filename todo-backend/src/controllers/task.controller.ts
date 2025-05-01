import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { JwtPayload } from 'jsonwebtoken';
import { TaskService } from '../services/task.service';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';

type UserSession = JwtPayload & {
  sub: string;
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserSession | undefined;
    if (!user || !user.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where: {
          user: {
            id: parseInt(user.userId)
          }
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.task.count({
        where: {
          user: {
            id: parseInt(user.userId)
          }
        },
      }),
    ]);

    res.json({
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error in getAllTasks:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserSession | undefined;
    if (!user || !user.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const task = await prisma.task.create({
      data: {
        ...req.body,
        user: {
          connect: {
            id: parseInt(user.userId)
          }
        }
      },
    });
    res.json(task);
  } catch (error) {
    console.error('Error in createTask:', error);
    res.status(500).json({ error: 'Error creating task' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserSession | undefined;
    if (!user || !user.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const task = await prisma.task.update({
      where: { 
        id: parseInt(req.params.id),
        user: {
          id: parseInt(user.userId)
        }
      },
      data: req.body,
    });
    res.json(task);
  } catch (error) {
    console.error('Error in updateTask:', error);
    res.status(500).json({ error: 'Error updating task' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserSession | undefined;
    if (!user || !user.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await prisma.task.delete({
      where: { 
        id: parseInt(req.params.id),
        user: {
          id: parseInt(user.userId)
        }
      },
    });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
};

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  createTask = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const createTaskDto: CreateTaskDto = req.body;
      const task = await this.taskService.createTask(userId, createTaskDto);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getTasks = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const tasks = await this.taskService.getTasks(userId);
      res.json(tasks);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getTaskById = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const taskId = parseInt(req.params.id);
      const task = await this.taskService.getTaskById(userId, taskId);
      res.json(task);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  updateTask = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const taskId = parseInt(req.params.id);
      const updateTaskDto: UpdateTaskDto = req.body;
      const task = await this.taskService.updateTask(userId, taskId, updateTaskDto);
      res.json(task);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  deleteTask = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const taskId = parseInt(req.params.id);
      const result = await this.taskService.deleteTask(userId, taskId);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };
} 