import fs from "node:fs";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL_UNPOOLED;
if (!databaseUrl) throw new Error("DATABASE_URL_UNPOOLED is required for migrations");

const sql = neon(databaseUrl);
const statements = fs
  .readFileSync("db/migrations/001_initial.sql", "utf8")
  .split(";")
  .map((statement) => statement.trim())
  .filter(Boolean);

for (const statement of statements) await sql.query(statement);

const tables = await sql.query(
  "select table_name from information_schema.tables where table_schema = 'public' order by table_name"
);

console.log(`Migration complete: ${tables.map(({ table_name }) => table_name).join(", ")}`);
