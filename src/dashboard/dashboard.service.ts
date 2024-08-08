import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from 'src/tasks/entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Dashboard } from './entities/dashboard.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Dashboard> {
    const taskCount = await this.tasksRepository.count();
    const userCount = await this.usersRepository.count();
    return {
      task: taskCount,
      user: userCount,
    };
  }
}
