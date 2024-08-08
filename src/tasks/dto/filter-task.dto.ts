import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../entities/task-enum';

export class FilterTaskDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
