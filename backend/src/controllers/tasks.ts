import { Request, Response } from "express";
import db from "../db/knex";
import { createTask, getAllTasks, updateTaskAssignment, updateTaskStatus } from "../services/tasksService";
import { TaskForm } from "../models/tasks";

export const getAllTasksController = async (req: Request, res: Response) => {
  try {
    const tasks = await getAllTasks();
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const createNewTask = async (req: Request, res: Response) => {
  try {
    const taskArray: TaskForm[] = req.body
    const resultArray: number[] = []
    for(const task of taskArray) {
        const result = await createTask(task,null,[]);
        resultArray.push(...result)
    }

    res.status(201).json({
      message: "Task created successfully",
      data: {
        taskIds: resultArray
      },
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
};

export const updateTaskStatusController = async (req:Request, res: Response) => {
    try {
        const { taskId, status } = req.body
        const result = await updateTaskStatus(taskId,status)
        if(result == null) {
            return res.status(400).json({
                error: "No updates were made"
            })
            
        }
        res.status(201).json({
            message: "Task status updated successfully",
            data: {
                taskId:result.id
            },
        });

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to update task status" });
    } 

}

export const updateTaskAssignmentController = async (req:Request, res:Response) => {
    try {
        const { taskId, developerId } = req.body
        const result = await updateTaskAssignment(taskId,developerId)
        if(result == null) {
            return res.status(400).json({
                error: "No updates were made"
            })
            
        }
        res.status(201).json({
            message: "Task assignment updated successfully",
            data: {
                taskId : result.task_id
            },
        });
 
    } catch(err) {
        console.error(err)
        res.status(500).json({ error: "Failed to update task status" });
    }
}