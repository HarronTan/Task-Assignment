import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CreateTask from "../pages/TaskCreate";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/tasks/create" element={<CreateTask />} />
        {/* Tasks */}
        {/* <Route path="/tasks" element={<TaskList />} />
        <Route path="/tasks/:id" element={<TaskDetail />} /> */}

        {/* Developers */}
        {/* <Route path="/developers" element={<DeveloperList />} />
        <Route path="/developers/:id" element={<DeveloperDetail />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
