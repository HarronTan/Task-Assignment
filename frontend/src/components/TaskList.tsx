import { useEffect, useState } from "react";
import { fetchData, putData } from "../api/apiClient";
import { Status, TaskDetail } from "../types/Task";
import { DeveloperDetail } from "../types/Developer";
import { Skill } from "../types/Skill";
import { useNavigate } from "react-router-dom";

export default function TaskList() {
  const [tasks, setTasks] = useState<TaskDetail[]>([]);
  const [developers, setDevelopers] = useState<DeveloperDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const [taskData, devData] = await Promise.all([
        fetchData<TaskDetail[]>("tasks"),
        fetchData<DeveloperDetail[]>("developers"),
      ]);

      if (taskData) setTasks(taskData);
      if (devData) setDevelopers(devData);

      console.log(taskData);
      console.log(devData);
      setLoading(false);
    }

    load();
  }, []);

  async function updateStatus(
    taskId: number,
    status: Status,
    subTasks: TaskDetail[]
  ) {
    if (status === "Done") {
      const hasIncomplete = subTasks.some((task) => task.status === "To-do");

      if (hasIncomplete) {
        alert("Please complete sub tasks first!");
        return;
      }
    }
    if (status === "To-do") {
      const parent = findParentTask(tasks, taskId);

      if (parent && parent.status === "Done") {
        alert("Parent task is already Done. You cannot downgrade a subtask.");
        return;
      }
    }

    const result = await putData<any>(`tasks/status`, { taskId, status });
    if (result.error) return;

    const updateRecursive = (taskList: TaskDetail[]): TaskDetail[] =>
      taskList.map((t) => {
        if (t.id === taskId) return { ...t, status };
        if (t.subTasks?.length) t.subTasks = updateRecursive(t.subTasks);
        return t;
      });

    setTasks((prev) => updateRecursive(prev));
  }

  function findParentTask(
    tasks: TaskDetail[],
    childId: number,
    parent: TaskDetail | null = null
  ): TaskDetail | null {
    for (const task of tasks) {
      if (task.id === childId) return parent;
      if (task.subTasks?.length) {
        const found = findParentTask(task.subTasks, childId, task);
        if (found) return found;
      }
    }
    return null;
  }

  async function updateAssignee(taskId: number, developerId: number | null) {
    await putData(`tasks/assignment`, { taskId, developerId });

    const updateRecursive = (taskList: TaskDetail[]): TaskDetail[] =>
      taskList.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            assignees: developerId
              ? [
                  {
                    id: developerId,
                    name: developers.find((d) => d.id === developerId)!.name,
                  },
                ]
              : [],
          };
        }
        if (t.subTasks?.length) t.subTasks = updateRecursive(t.subTasks);
        return t;
      });

    setTasks((prev) => updateRecursive(prev));
  }

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div>
      <h2 style={{ textAlign: "left" }}>Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <table style={{ width: "100%", textAlign: "left" }}>
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Skills</th>
              <th>Status</th>
              <th>Assignee</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                developers={developers}
                updateStatus={updateStatus}
                updateAssignee={updateAssignee}
                level={0}
              />
            ))}
          </tbody>
        </table>
      )}
      <button
        style={{ marginTop: "20px" }}
        onClick={() => navigate("/tasks/create")}
      >
        Create New Task
      </button>
    </div>
  );
}

interface TaskRowProps {
  task: TaskDetail;
  developers: DeveloperDetail[];
  updateStatus: (
    taskId: number,
    status: Status,
    subTasks: TaskDetail[]
  ) => void;
  updateAssignee: (taskId: number, developerId: number | null) => void;
  level: number;
}

function TaskRow({
  task,
  developers,
  updateStatus,
  updateAssignee,
  level,
}: TaskRowProps) {
  const padding = level * 20;

  return (
    <>
      <tr>
        <td style={{ paddingLeft: `${padding}px` }}>{task.title}</td>
        <td>{task.skills?.map((s) => s.name).join(", ") ?? "-"}</td>
        <td>
          <select
            value={task.status}
            onChange={(e) =>
              updateStatus(task.id, e.target.value as Status, task.subTasks)
            }
          >
            <option value="To-do">To-do</option>
            <option value="Done">Done</option>
          </select>
        </td>
        <td>
          <select
            value={task.assignees.length > 0 ? task.assignees[0].id : ""}
            onChange={(e) =>
              updateAssignee(
                task.id,
                e.target.value ? Number(e.target.value) : null
              )
            }
          >
            <option value="">Unassigned</option>
            {developers
              .filter((dev) => hasRequiredSkills(dev.skills, task.skills ?? []))
              .map((dev) => (
                <option key={dev.id} value={dev.id}>
                  {dev.name}
                </option>
              ))}
          </select>
        </td>
      </tr>

      {task.subTasks?.map((sub) => (
        <TaskRow
          key={sub.id}
          task={sub}
          developers={developers}
          updateStatus={updateStatus}
          updateAssignee={updateAssignee}
          level={level + 1}
        />
      ))}
    </>
  );
}

function hasRequiredSkills(devSkills: Skill[], taskSkills: Skill[]): boolean {
  if (taskSkills.length === 0) return true;
  const devSkillIds = new Set(devSkills.map((s) => s.id));
  return taskSkills.every((skill) => devSkillIds.has(skill.id));
}
