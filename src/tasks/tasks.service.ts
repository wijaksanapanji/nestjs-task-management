import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    async getAllTasks(): Promise<Task[]> {
        return this.tasks;
    }

    async getFilteredTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;

        let tasks = [...this.tasks];

        if (status) {
            tasks = tasks.filter((task) => task.status === status);
        }

        if (search) {
            tasks = tasks.filter((task) => {
                if (
                    task.title
                        .toLocaleLowerCase()
                        .includes(search.toLocaleLowerCase()) ||
                    task.description
                        .toLocaleLowerCase()
                        .includes(search.toLocaleLowerCase())
                ) {
                    return true;
                } else {
                    return false;
                }
            });
        }
        return tasks;
    }

    async getTaskById(id: string): Promise<Task> {
        const task = this.tasks.find((task) => task.id === id);
        if (!task) {
            throw new NotFoundException();
        }
        return task;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;

        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        };
        this.tasks.push(task);

        return task;
    }

    async deleteTask(id: string): Promise<void> {
        const index = this.tasks.findIndex((task) => task.id === id);
        if (index === -1) {
            throw new NotFoundException();
        }
        this.tasks.splice(index, 1);
    }

    async updateTaskStatus(
        id: string,
        updateTaskStatusDto: UpdateTaskStatusDto,
    ): Promise<Task> {
        let updatedTask: Task;

        const { status } = updateTaskStatusDto;
        this.tasks = this.tasks.map((task) => {
            if (task.id === id) {
                updatedTask = { ...task, status: status };
                return updatedTask;
            }
            return task;
        });

        if (!updatedTask) {
            throw new NotFoundException();
        }

        return updatedTask;
    }
}
