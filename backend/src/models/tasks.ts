import { Skill } from "./skill";
import { Developer } from "./developer";

export interface Task {
  id: number;
  title: string;
  status: "To-do" | "Done";
  parent_task_id: number
}

export interface TaskDetail {
    id: number;
    title: string;
    status: "To-do" | "Done";
    skills: Skill[];
    assignees: Developer[];
    subTasks: TaskDetail[]
} 

export interface TaskForm {
  title: string;
  skills: string;
  status: "To-do" | "Done";
  subtasks: TaskForm[];
}