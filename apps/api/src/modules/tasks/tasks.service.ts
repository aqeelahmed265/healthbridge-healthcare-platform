import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TaskStatus, TaskPriority } from '@healthbridge/shared';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(
    title: string,
    dueDate: Date,
    assigneeId?: string,
    creatorId?: string,
    patientId?: string,
    carePlanId?: string,
    description?: string,
    priority: TaskPriority = TaskPriority.MEDIUM,
  ) {
    return this.prisma.task.create({
      data: {
        title,
        dueDate,
        assigneeId,
        creatorId,
        patientId,
        carePlanId,
        description,
        priority,
        status: TaskStatus.PENDING,
      },
    });
  }

  async listTasks(assigneeId?: string, patientId?: string, status?: TaskStatus) {
    const where: any = {};
    if (assigneeId) where.assigneeId = assigneeId;
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;

    return this.prisma.task.findMany({
      where,
      include: {
        patient: true,
        assignee: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async updateTaskStatus(id: string, status: TaskStatus) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    return this.prisma.task.update({
      where: { id },
      data: {
        status,
        completedAt: status === TaskStatus.COMPLETED ? new Date() : null,
      },
    });
  }
}
