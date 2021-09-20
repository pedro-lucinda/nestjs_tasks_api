import { NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './DTO/create-task.dto';
import { GetTasksFilterDTO } from './DTO/get-tasks-filter.dto';
import { TasksStatus } from './types/task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async getAll(
    getFilteredTasksDTO: GetTasksFilterDTO,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = getFilteredTasksDTO;
    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async getTasksByStatus(status: TasksStatus): Promise<Task[]> {
    return await this.find({ status });
  }

  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDTO;
    const newTask = this.create({
      title,
      description,
      status: TasksStatus.OPEN,
      user,
    });
    await this.save(newTask);
    return newTask;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.findOne({ id, user });
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  async updateStatus(
    id: string,
    status: TasksStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.update(id, { status });
    return task;
  }
}
