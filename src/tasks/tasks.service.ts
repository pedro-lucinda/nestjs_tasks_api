import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDTO } from './DTO/create-task.dto';
import { GetTasksFilterDTO } from './DTO/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './DTO/update-task-status.dto';
import { TasksStatus } from './types/task-status.enum';
import { Task } from './task.entity';
import { TasksRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private taskRepository: TasksRepository,
  ) {}

  async getAllTasks(
    getFilteredTasksDTO: GetTasksFilterDTO,
    user: User,
  ): Promise<Task[]> {
    return await this.taskRepository.getAll(getFilteredTasksDTO, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    return await this.taskRepository.getTaskById(id, user);
  }
  async deleteById({ id, user }): Promise<string> {
    const task = await this.taskRepository.getTaskById(id, user);
    if (task) {
      await this.taskRepository.delete(id);
      return 'Success';
    }
  }

  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDTO, user);
  }

  async updateTaskById({ id, status, user }): Promise<Task> {
    return await this.taskRepository.updateStatus(id, status, user);
  }
}
