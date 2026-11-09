import { neon } from "@neondatabase/serverless";

export function db() {
  const connection = process.env.DATABASE_URL;
  if (!connection) throw new Error("DATABASE_URL is not configured");
  return neon(connection);
}
