import { Router } from "express";
import { getDevelopers } from "../controllers/developers";

const router = Router();

router.get("/", getDevelopers);

export default router;