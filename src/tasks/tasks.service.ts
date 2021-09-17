import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDTO } from './DTO/create-task.dto';
import { GetTasksFilterDTO } from './DTO/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './DTO/update-task-status.dto';
import { TasksStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private taskRepository: TasksRepository,
  ) {}

  async getAllTasks(getFilteredTasksDTO: GetTasksFilterDTO): Promise<Task[]> {
    return await this.taskRepository.getAll(getFilteredTasksDTO);
  }

  async getTaskById(id: string): Promise<Task> {
    return await this.taskRepository.getTaskById(id);
  }
  async deleteById({ id }): Promise<string> {
    const task = await this.taskRepository.getTaskById(id);
    if (task) {
      await this.taskRepository.delete(id);
      return 'Success';
    }
  }

  async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDTO);
  }

  async updateTaskById({ id, status }): Promise<Task> {
    await this.taskRepository.getTaskById(id);
    return await this.taskRepository.updateStatus(id, status);
  }
}
