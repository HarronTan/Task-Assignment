import { Request, Response } from "express";
import db from "../db/knex";

export const getSkills = async (req: Request, res: Response) => {
  try {
    const skills = await db("skills").select("id", "name");
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch skills" });
  }
};
