import { Developer } from "./Developer";
import { Skill } from "./Skill";

export interface TaskDetail {
    id: number;
    title: string;
    status: "To-do" | "Done";
    skills: Skill[];
    assignees: Developer[];
    subTasks: TaskDetail[]
} 

export type Status = "To-do" | "Done"