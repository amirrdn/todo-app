import { TaskService } from '../task.service';
import { PrismaClient, Task } from '@prisma/client';
import { CreateTaskDto, UpdateTaskDto } from '../../dto/task.dto';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

describe('TaskService', () => {
  let taskService: TaskService;
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;
    taskService = new TaskService();
    // @ts-ignore - Override private property for testing
    taskService['prisma'] = mockPrisma;
  });

  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      const userId = 1;
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        userId: 1,
      };

      const mockTask: Task = {
        id: 1,
        title: createTaskDto.title,
        description: createTaskDto.description,
        completed: false,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.task.create as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.createTask(userId, createTaskDto);

      expect(mockPrisma.task.create).toHaveBeenCalledWith({
        data: {
          ...createTaskDto,
          userId,
          completed: false,
        },
        select: {
          id: true,
          title: true,
          description: true,
          completed: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(mockTask);
    });
  });

  describe('getTasks', () => {
    it('should get all tasks for a user', async () => {
      const userId = 1;
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          completed: false,
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Description 2',
          completed: true,
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (mockPrisma.task.findMany as jest.Mock).mockResolvedValue(mockTasks);

      const result = await taskService.getTasks(userId);

      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        where: { userId },
        select: {
          id: true,
          title: true,
          description: true,
          completed: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toEqual(mockTasks);
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const userId = 1;
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
        completed: true,
      };

      const mockTask: Task = {
        id: taskId,
        title: updateTaskDto.title || '',
        description: updateTaskDto.description || '',
        completed: updateTaskDto.completed || false,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.task.findFirst as jest.Mock).mockResolvedValue({ id: taskId, userId });
      (mockPrisma.task.update as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.updateTask(userId, taskId, updateTaskDto);

      expect(mockPrisma.task.findFirst).toHaveBeenCalledWith({
        where: {
          id: taskId,
          userId,
        },
      });
      expect(mockPrisma.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: updateTaskDto,
        select: {
          id: true,
          title: true,
          description: true,
          completed: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(mockTask);
    });

    it('should throw error if task not found', async () => {
      const userId = 1;
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
      };

      (mockPrisma.task.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        taskService.updateTask(userId, taskId, updateTaskDto)
      ).rejects.toThrow('Task not found');
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      const userId = 1;
      const taskId = 1;

      (mockPrisma.task.findFirst as jest.Mock).mockResolvedValue({ id: taskId, userId });
      (mockPrisma.task.delete as jest.Mock).mockResolvedValue({ id: taskId });

      const result = await taskService.deleteTask(userId, taskId);

      expect(mockPrisma.task.findFirst).toHaveBeenCalledWith({
        where: {
          id: taskId,
          userId,
        },
      });
      expect(mockPrisma.task.delete).toHaveBeenCalledWith({
        where: { id: taskId },
      });
      expect(result).toEqual({ message: 'Task deleted successfully' });
    });

    it('should throw error if task not found', async () => {
      const userId = 1;
      const taskId = 1;

      (mockPrisma.task.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(taskService.deleteTask(userId, taskId)).rejects.toThrow(
        'Task not found'
      );
    });
  });
}); 