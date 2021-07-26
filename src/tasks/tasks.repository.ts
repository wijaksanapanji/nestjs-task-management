import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;

        const query = this.createQueryBuilder('task');

        if (status) {
            query.where(`task.status = :status`, { status: status });
        }

        if (search) {
            query.where(
                `LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search`,
                { search: `%${search.toLowerCase()}%` },
            );
        }

        const tasks = await query.getMany();

        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
        });
        await this.save(task);

        return task;
    }
}
