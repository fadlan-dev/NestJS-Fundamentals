import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { FilterTaskDto } from './dto/filter-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskStatus } from './entities/task-enum';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      status: TaskStatus.TODO,
      user,
    });

    await this.tasksRepository.save(task);
    return task;
  }

  async findAll(user: User): Promise<Task[]> {
    const tasksByUser = await this.tasksRepository.find({
      where: { user: { id: user.id } },
    });
    return tasksByUser;
  }

  async findWithFilter(@Query() filterDto: FilterTaskDto, user: User) {
    const { search, status } = filterDto;
    let tasks = await this.findAll(user);

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      tasks = tasks.filter((task) => {
        if (task.title.match(regex) || task.description.match(regex))
          return true;
      });
    }

    return tasks;
  }

  async findOne(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
    });

    // if not found, throw an error
    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = await this.findOne(id, user);

    task.title = updateTaskDto.title;
    task.description = updateTaskDto.description;
    task.status = updateTaskDto.status;

    const saved = await this.tasksRepository.save(task);
    return saved;
  }

  async updateStatus(
    id: string,
    updateStatusTaskDto: { status: TaskStatus },
    user: User,
  ): Promise<Task> {
    const task = await this.findOne(id, user);

    task.status = updateStatusTaskDto.status;

    const saved = await this.tasksRepository.save(task);
    return saved;
  }

  async remove(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException();
    }

    return;
  }
}
