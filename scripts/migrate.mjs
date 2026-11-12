import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL_UNPOOLED;
if (!databaseUrl) throw new Error("DATABASE_URL_UNPOOLED is required for migrations");

const sql = neon(databaseUrl);
const migrationDirectory = "db/migrations";
const migrationFiles = fs
  .readdirSync(migrationDirectory)
  .filter((file) => file.endsWith(".sql"))
  .sort();

for (const migrationFile of migrationFiles) {
  const statements = fs
    .readFileSync(path.join(migrationDirectory, migrationFile), "utf8")
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) await sql(statement);
  console.log(`Applied ${migrationFile}`);
}

const tables = await sql(
  "select table_name from information_schema.tables where table_schema = 'public' order by table_name"
);

console.log(`Migration complete: ${tables.map(({ table_name }) => table_name).join(", ")}`);
