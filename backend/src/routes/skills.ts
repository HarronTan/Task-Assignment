import { Router } from "express";
import { getSkills } from "../controllers/skills";

const router = Router();
router.get("/", getSkills);
export default router;
