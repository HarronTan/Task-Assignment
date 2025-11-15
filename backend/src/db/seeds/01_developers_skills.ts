import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    //Seed data
    const skillsRow = await knex("skills").select("id");
    const developersRow = await knex("developers").select("id");
    const developersSkillsRow = await knex("developer_skills").select("id");

    if(skillsRow.length > 0 && developersRow.length > 0 && developersSkillsRow.length > 0) return 

    // 1. Insert skills
    const skillIds: Record<string, number> = {};
    const skills = ["frontend", "backend"];
    for (const name of skills) {
        const [skillRow] = await knex("skills").insert({ name }).returning("id");
        skillIds[name] = skillRow.id; 
    }

    // 2. Insert developers
    const devIds: Record<string, number> = {};
    const developers = ["Alice", "Bob", "Carol", "Dave"];
    for (const name of developers) {
        const [devRow] = await knex("developers").insert({ name }).returning("id");
        devIds[name] = devRow.id; 
    }

    // 3. Assign skills to developers
    const devSkills = [
        { dev: "Alice", skill: "frontend" },
        { dev: "Bob", skill: "backend" },
        { dev: "Carol", skill: "frontend" },
        { dev: "Carol", skill: "backend" },
        { dev: "Dave", skill: "backend" },
    ];

    for (const { dev, skill } of devSkills) {
        await knex("developer_skills").insert({
        developer_id: devIds[dev],
        skill_id: skillIds[skill],
        });
    }


};
