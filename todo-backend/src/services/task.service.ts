import { PrismaClient } from '@prisma/client'
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto'

export class TaskService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async createTask(userId: number, createTaskDto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId,
        completed: false
      },
      select: {
        id: true,
        title: true,
        description: true,
        completed: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return task
  }

  async getTasks(userId: number) {
    const tasks = await this.prisma.task.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        description: true,
        completed: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return tasks
  }

  async getTaskById(userId: number, taskId: number) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        userId
      },
      select: {
        id: true,
        title: true,
        description: true,
        completed: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!task) {
      throw new Error('Task not found')
    }

    return task
  }

  async updateTask(userId: number, taskId: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        userId
      }
    })

    if (!task) {
      throw new Error('Task not found')
    }

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: updateTaskDto,
      select: {
        id: true,
        title: true,
        description: true,
        completed: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return updatedTask
  }

  async deleteTask(userId: number, taskId: number) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        userId
      }
    })

    if (!task) {
      throw new Error('Task not found')
    }

    await this.prisma.task.delete({
      where: { id: taskId }
    })

    return { message: 'Task deleted successfully' }
  }
} 