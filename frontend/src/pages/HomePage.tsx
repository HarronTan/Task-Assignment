import TaskList from "../components/TaskList";

export default function HomePage() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Welcome to My React + TypeScript App</h1>
      <TaskList />
    </div>
  );
}
