import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TasksRepository)
        private tasksRepository: TasksRepository,
    ) {}

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.tasksRepository.getTasks(filterDto, user);
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const task = await this.tasksRepository.findOne({
            where: { id, user },
        });

        if (!task) {
            throw new NotFoundException(`Task with id: ${id} not found.`);
        }
        return task;
    }

    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.tasksRepository.createTask(createTaskDto, user);
    }

    async deleteTask(id: string, user: User): Promise<void> {
        const result = await this.tasksRepository.delete({ id, user });
        if (result.affected === 0) {
            throw new NotFoundException(`Task with id: ${id} not found.`);
        }
    }

    async updateTask(
        id: string,
        updateTaskStatusDto: UpdateTaskStatusDto,
        user: User,
    ): Promise<Task> {
        const { status } = updateTaskStatusDto;

        const task = await this.getTaskById(id, user);
        task.status = status;
        await this.tasksRepository.save(task);

        return task;
    }
}
