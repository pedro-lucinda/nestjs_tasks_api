import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TasksStatus } from '../task-status.enum';

export class GetTasksFilterDTO {
  @IsOptional()
  @IsEnum(TasksStatus)
  status?: TasksStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
