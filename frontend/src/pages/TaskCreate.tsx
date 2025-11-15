import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../api/apiClient";

interface TaskForm {
  title: string;
  skills: string;
  status: "To-do" | "Done";
  subtasks: TaskForm[];
}

export default function CreateTaskPage() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<TaskForm[]>([
    { title: "", skills: "", status: "To-do", subtasks: [] },
  ]);

  const handleTaskChange = (
    path: number[],
    field: keyof TaskForm,
    value: string | "To-do" | "Done"
  ) => {
    const updateTasks = [...tasks];

    let current: any = updateTasks;
    for (let i = 0; i < path.length; i++) {
      current = current[path[i]].subtasks;
      if (i === path.length - 1) current = updateTasks[path[0]];
    }

    let taskRef = updateTasks[path[0]];
    for (let i = 1; i < path.length; i++) {
      taskRef = taskRef.subtasks[path[i]];
    }

    taskRef[field] = value as any;
    setTasks(updateTasks);
  };

  const addSubtask = (path: number[]) => {
    const updateTasks = [...tasks];
    let taskRef = updateTasks[path[0]];
    for (let i = 1; i < path.length; i++) {
      taskRef = taskRef.subtasks[path[i]];
    }
    taskRef.subtasks.push({
      title: "",
      skills: "",
      status: "To-do",
      subtasks: [],
    });
    setTasks(updateTasks);
  };

  function getParentTasks(tree: TaskForm[], path: number[]): TaskForm[] {
    const parents: TaskForm[] = [];
    let node: TaskForm | TaskForm[] = tree;

    for (let i = 0; i < path.length - 1; i++) {
      const index = path[i];

      // Safety check: index exists
      if (!Array.isArray(node) || !node[index]) return parents;

      // Push this parent
      parents.push(node[index]);

      // Go one level deeper into subtasks
      node = node[index].subtasks;
    }

    return parents;
  }

  const renderTask = (task: TaskForm, path: number[], level = 0) => (
    <div
      key={path.join("-")}
      style={{
        marginLeft: `${level * 20}px`,
        border: "1px dashed #aaa",
        padding: "8px",
        marginBottom: "8px",
      }}
    >
      <input
        placeholder="Title"
        value={task.title}
        onChange={(e) => handleTaskChange(path, "title", e.target.value)}
        style={{ marginRight: "8px" }}
      />
      <input
        placeholder="Skills (comma separated)"
        value={task.skills}
        onChange={(e) => handleTaskChange(path, "skills", e.target.value)}
        style={{ marginRight: "8px" }}
      />
      <select
        value={task.status}
        onChange={(e) => {
          if (e.target.value === "Done") {
            const hasIncomplete = task.subtasks.some(
              (task) => task.status === "To-do"
            );

            if (hasIncomplete) {
              alert("Sub tasks needs to be done first!");
              return;
            }
          }
          if (e.target.value === "To-do") {
            const parentTasks = getParentTasks(tasks, path);
            console.log(parentTasks);
            const hasDoneParent = parentTasks.some((p) => p.status === "Done");

            if (hasDoneParent) {
              alert(
                "You cannot mark this as To-do because its parent task is already Done."
              );
              return;
            }
          }
          handleTaskChange(path, "status", e.target.value as "To-do" | "Done");
        }}
        style={{ marginRight: "8px" }}
      >
        <option value="To-do">To-do</option>
        <option value="Done">Done</option>
      </select>
      <button
        type="button"
        onClick={() => {
          if (task.status === "Done") {
            alert(
              "Please change the task status to To-do first before adding sub tasks."
            );
            return;
          }
          addSubtask(path);
        }}
      >
        Add Subtask
      </button>

      {task.subtasks.map((subtask, idx) =>
        renderTask(subtask, [...path, idx], level + 1)
      )}
    </div>
  );

  const handleSubmit = async () => {
    for (const task of tasks) {
      const error = validateTask(task);
      if (error) {
        alert(error);
        return;
      }
    }

    const formatTask = (task: TaskForm): any => ({
      title: task.title,
      skills:
        task.skills === "" ? [] : task.skills.split(",").map((s) => s.trim()),
      status: task.status,
      subtasks: task.subtasks.map(formatTask),
    });

    const payload = tasks.map(formatTask);
    console.log(payload);
    const res = await postData<any>("tasks", payload); // assume backend endpoint to handle nested tasks

    if (res.error) {
      alert(res.error);
      return;
    }

    navigate("/");
  };

  function validateTask(task: TaskForm): string | null {
    if (!task.title || task.title.trim() === "") {
      return "Every task must have a title.";
    }

    if (task.subtasks && task.subtasks.length > 0) {
      for (const sub of task.subtasks) {
        const error = validateTask(sub);
        if (error) return error;
      }
    }

    return null;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create Task(s)</h2>
      {tasks.map((task, idx) => renderTask(task, [idx]))}

      <button
        type="button"
        style={{ marginTop: "16px" }}
        onClick={() =>
          setTasks([
            ...tasks,
            { title: "", skills: "", status: "To-do", subtasks: [] },
          ])
        }
      >
        Add Task
      </button>

      <button
        type="button"
        style={{ marginTop: "16px", marginLeft: "16px" }}
        onClick={handleSubmit}
      >
        Save All Tasks
      </button>
    </div>
  );
}
