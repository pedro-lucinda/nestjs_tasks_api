import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDTO } from './DTO/create-task.dto';
import { GetTasksFilterDTO } from './DTO/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './DTO/update-task-status.dto';

import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksServices: TasksService) {}

  @Get()
  async getTask(
    @Query() getTasksFilterDTO: GetTasksFilterDTO,
  ): Promise<Task[]> {
    return await this.tasksServices.getAllTasks(getTasksFilterDTO);
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return await this.tasksServices.getTaskById(id);
  }

  @Post()
  async createTask(
    @Body() { title, description }: CreateTaskDTO,
  ): Promise<Task> {
    return await this.tasksServices.createTask({ title, description });
  }

  @Delete('/:id')
  async deleteTaskById(@Param('id') id: string): Promise<string> {
    return await this.tasksServices.deleteById({ id });
  }

  @Patch('/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDTO: UpdateTaskStatusDTO,
  ): Promise<Task> {
    const { status } = updateTaskStatusDTO;
    const updatedTask = this.tasksServices.updateTaskById({
      id,
      status,
    });
    return updatedTask;
  }
}
