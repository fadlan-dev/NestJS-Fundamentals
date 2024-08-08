import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../entities/task-enum';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}
