import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserPayload } from '@healthbridge/contracts';
import { TaskStatus, TaskPriority } from '@healthbridge/shared';

@ApiTags('Task Management')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new staff or patient task' })
  createTask(
    @Body('title') title: string,
    @Body('dueDate') dueDate: string,
    @Body('assigneeId') assigneeId?: string,
    @Body('patientId') patientId?: string,
    @Body('carePlanId') carePlanId?: string,
    @Body('description') description?: string,
    @Body('priority') priority?: TaskPriority,
    @CurrentUser() user?: UserPayload,
  ) {
    return this.tasksService.createTask(
      title,
      new Date(dueDate),
      assigneeId || user?.id,
      user?.id,
      patientId,
      carePlanId,
      description,
      priority,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List tasks assigned to user or patient' })
  listTasks(
    @CurrentUser() user: UserPayload,
    @Query('assigneeId') assigneeId?: string,
    @Query('patientId') patientId?: string,
    @Query('status') status?: TaskStatus,
  ) {
    return this.tasksService.listTasks(assigneeId || user.id, patientId, status);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update task status (Completed, In-Progress)' })
  updateStatus(@Param('id') id: string, @Body('status') status: TaskStatus) {
    return this.tasksService.updateTaskStatus(id, status);
  }
}
