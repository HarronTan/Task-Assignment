import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("tasks", (table) => {
    table
      .integer("parent_task_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("tasks")
      .onDelete("CASCADE");
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("tasks", (table) => {
    table.dropColumn("parent_task_id");
  });
}

