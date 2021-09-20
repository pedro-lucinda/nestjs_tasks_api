import { IsEnum, IsString, IsUUID } from 'class-validator';
import { TasksStatus } from '../types/task-status.enum';

export class UpdateTaskStatusDTO {
  @IsEnum(TasksStatus)
  status: TasksStatus;
}
