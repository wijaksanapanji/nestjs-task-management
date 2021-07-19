import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get()
    async getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
        // if there is filter present get filtered tasks
        // else return all tasks
        if (Object.keys(filterDto).length) {
            return await this.tasksService.getFilteredTasks(filterDto);
        }

        return await this.tasksService.getAllTasks();
    }

    @Get(':id')
    async getTaskById(@Param('id') id: string): Promise<Task> {
        return await this.tasksService.getTaskById(id);
    }

    @Post()
    async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return await this.tasksService.createTask(createTaskDto);
    }

    @Delete(':id')
    async deleteTask(@Param('id') id: string): Promise<void> {
        return await this.tasksService.deleteTask(id);
    }

    @Patch(':id/status')
    async updateTaskStatus(
        @Param('id') id: string,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    ): Promise<Task> {
        return await this.tasksService.updateTaskStatus(
            id,
            updateTaskStatusDto,
        );
    }
}
