import db from "../db/knex";
import { TaskAssignment } from "../models/taskAssignment";
import { Task, TaskDetail, TaskForm } from "../models/tasks";
import { generateSkillsFromTask } from "./genai";

interface TaskInput {
  title: string;
  status?: "To-do" | "Done";
  skills: string[]; 
}

type Status = "To-do" | "Done"

export const getAllTasks = async (): Promise<TaskDetail[]> => {
  // Only root tasks (parent_task_id is NULL)
  const tasks = await db("tasks").select("id", "title", "status").whereNull("parent_task_id");

  return Promise.all(
    tasks.map(async (task) => {
      const skills = await db("task_skills")
        .join("skills", "task_skills.skill_id", "skills.id")
        .where("task_skills.task_id", task.id)
        .select("skills.id", "skills.name");

      const assignees = await db("task_assignments")
        .join("developers", "task_assignments.developer_id", "developers.id")
        .where("task_assignments.task_id", task.id)
        .select("developers.id", "developers.name");

      const subTasks = await fetchSubtasks(task.id);

      return {
        id: task.id,
        title: task.title,
        status: task.status,
        skills,
        assignees,
        subTasks,
      };
    })
  );
};

const fetchSubtasks = async (parentId: number): Promise<TaskDetail[]> => {
  const subtasks = await db("tasks")
    .select("id", "title", "status")
    .where("parent_task_id", parentId);

  return Promise.all(
    subtasks.map(async (subtask) => {
      const skills = await db("task_skills")
        .join("skills", "task_skills.skill_id", "skills.id")
        .where("task_skills.task_id", subtask.id)
        .select("skills.id", "skills.name");

      const assignees = await db("task_assignments")
        .join("developers", "task_assignments.developer_id", "developers.id")
        .where("task_assignments.task_id", subtask.id)
        .select("developers.id", "developers.name");

      const nestedSubtasks = await fetchSubtasks(subtask.id);

      return {
        id: subtask.id,
        title: subtask.title,
        status: subtask.status,
        skills,
        assignees,
        subTasks: nestedSubtasks,
      };
    })
  );
};

export const createTask = async (task: TaskForm, mainTaskId: number | null,taskCreated:number[]) => {

    const {taskId} = await db.transaction(async (trx) => {
        const [taskRow] = await trx("tasks")    
        .insert({ title: task.title, status: task.status || "To-do", parent_task_id: mainTaskId })
        .returning("id");

        const taskId = taskRow.id;


        const skillIds: number[] = [];
        
        const skills: string[] = []
        console.log(task.skills)
        if(task.skills.length > 0) {
            skills.push(...task.skills)
        } else {
            const generatedSkills = await generateSkillsFromTask(task.title)
            skills.push(...generatedSkills)
        }

        if(skills.length > 0) {
            for (const nameRaw of skills) {
                const name = nameRaw.toLowerCase()
                let skill = await trx("skills").where({ name }).first("id");
                if (!skill) {
                    const [newSkill] = await trx("skills").insert({ name }).returning("id");
                    skillIds.push(newSkill.id);
                } else {
                    skillIds.push(skill.id);
                }
            }

            const taskSkills = skillIds.map((skillId) => ({
            task_id: taskId,
            skill_id: skillId,
            }));

            await trx("task_skills").insert(taskSkills);
        }



        return { taskId };
    })

    if(task.subtasks.length > 0) {
        for(const subtask of task.subtasks) {
            await createTask(subtask,taskId,[...taskCreated,taskId])
        }
    }
    
    return taskCreated;
};

export const updateTaskStatus = async (taskId:number, status: Status): Promise<Task | null> => {
    return await db("tasks")
        .update({status})
        .where({id:taskId})
        .returning("*")
        .then((row) => row.length > 0 ? row[0] : null)
}

export const updateTaskAssignment = async (taskId:number, developerId: number): Promise<TaskAssignment | null> => {
    return await db("task_assignments")
    .insert({
        task_id: taskId,
        developer_id: developerId,
    })
    .onConflict(["task_id"]) // or your actual unique constraint
    .merge()
    .returning("*")
    .then((row) => row.length > 0 ? row[0] : null)
} 

