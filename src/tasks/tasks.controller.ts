import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { Task } from './entities/task.entity';
import { TaskStatus } from './entities/task-enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  findAll(@Query() filterDto: FilterTaskDto, @GetUser() user: User) {
    if (Object.keys(filterDto).length) {
      return this.tasksService.findWithFilter(filterDto, user);
    }
    return this.tasksService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ) {
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Patch('/status/:id')
  updateStatus(
    @Param('id') id: string,
    @Body() updateTaskDto: { status: TaskStatus },
    @GetUser() user: User,
  ) {
    return this.tasksService.updateStatus(id, updateTaskDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.remove(id, user);
  }
}
