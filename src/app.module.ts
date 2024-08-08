import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DashboardModule } from './dashboard/dashboard.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST || 'localhost',
      port: Number(process.env.PG_PORT) || 5432,
      username: process.env.PG_USER || 'fadlan.j',
      password: process.env.PG_PASS || 'password',
      database: process.env.PG_DB || 'task-management',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    ConfigModule.forRoot({ envFilePath: ['.env', '.env.local'] }),
    DashboardModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
