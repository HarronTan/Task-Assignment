import { Router } from "express";
import { createNewTask, getAllTasksController, updateTaskAssignmentController, updateTaskStatusController } from "../controllers/tasks";

const router = Router();
router.get("/", getAllTasksController);
router.put("/status", updateTaskStatusController)
router.put("/assignment", updateTaskAssignmentController)
router.post("/", createNewTask)

export default router;
