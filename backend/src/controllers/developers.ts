import { Request, Response } from "express";
import db from "../db/knex";
import { DeveloperDetail } from "../models/developer";

export const getDevelopers = async (req: Request, res: Response) => {
  try {
    const rows = await db("developers")
      .leftJoin("developer_skills", "developers.id", "developer_skills.developer_id")
      .leftJoin("skills", "developer_skills.skill_id", "skills.id")
      .select(
        "developers.id as developer_id",
        "developers.name as developer_name",
        "skills.id as skill_id",
        "skills.name as skill_name"
      );

    // Group by developer
    const devMap: Record<number, DeveloperDetail> = {};

    rows.forEach((row) => {
      if (!devMap[row.developer_id]) {
        devMap[row.developer_id] = {
          id: row.developer_id,
          name: row.developer_name,
          skills: [],
        };
      }

      if (row.skill_id) {
        devMap[row.developer_id].skills.push({
          id: row.skill_id,
          name: row.skill_name,
        });
      }
    });

    res.json(Object.values(devMap));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch developers" });
  }
};
