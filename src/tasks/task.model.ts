import { TaskStatus } from './task-status.enum';

// Used when using in memory array arra
export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
}
