import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("task_assignments");
    await knex.schema.dropTableIfExists("task_skills");
    await knex.schema.dropTableIfExists("tasks");
    await knex.schema.dropTableIfExists("developer_skills");
    await knex.schema.dropTableIfExists("developers");
    await knex.schema.dropTableIfExists("skills");

    // 1. Skills table
    await knex.schema.createTable("skills", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable().unique();
    });

    // 2. Developers table
    await knex.schema.createTable("developers", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
    });

    // 3. Developer-Skill pivot table (many-to-many)
    await knex.schema.createTable("developer_skills", (table) => {
        table.increments("id").primary();
        table.integer("developer_id").unsigned().notNullable().references("id").inTable("developers").onDelete("CASCADE");
        table.integer("skill_id").unsigned().notNullable().references("id").inTable("skills").onDelete("CASCADE");
        table.unique(["developer_id", "skill_id"]);
    });

    // 4. Tasks table
    await knex.schema.createTable("tasks", (table) => {
        table.increments("id").primary();
        table.string("title").notNullable();
        table.enu("status", ["To-do", "Done"]).defaultTo("To-do");
    });

    // 5. Task-Skill pivot table (many-to-many)
    await knex.schema.createTable("task_skills", (table) => {
        table.increments("id").primary();
        table.integer("task_id").unsigned().notNullable().references("id").inTable("tasks").onDelete("CASCADE");
        table.integer("skill_id").unsigned().notNullable().references("id").inTable("skills").onDelete("CASCADE");
        table.unique(["task_id", "skill_id"]);
    });

    // 6. Task-Developer assignment table
    await knex.schema.createTable("task_assignments", (table) => {
        table.increments("id").primary();
        table.integer("task_id").unsigned().notNullable().references("id").inTable("tasks").onDelete("CASCADE");
        table.integer("developer_id").unsigned().notNullable().references("id").inTable("developers").onDelete("CASCADE");
        table.unique(["task_id"]);
    });
}


export async function down(knex: Knex): Promise<void> {

}

    
 
 