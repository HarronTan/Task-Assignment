import express, { Application, Request, Response } from "express";
import cors from "cors"
import developersRoutes from "./routes/developers";
import skillsRoutes from "./routes/skills";
import tasksRoutes from "./routes/tasks";
const app: Application = express();
const port: number = 5000;

app.use(cors()); 
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express with TypeScript!");
});

app.use("/api/developers", developersRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/tasks", tasksRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

