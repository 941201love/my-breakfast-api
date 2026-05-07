import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import * as schema from "./schema.ts";

const migrationUrl = process.env.DATABASE_URL_MIGRATION ?? process.env.DATABASE_URL;

if (!migrationUrl) {
  throw new Error("DATABASE_URL_MIGRATION or DATABASE_URL is required.");
}

const pool = new Pool({ connectionString: migrationUrl });
const db = drizzle({ client: pool, schema });

try {
  console.log("Drizzle migration: applying migrations from ./drizzle");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Drizzle migration: OK");
} finally {
  await pool.end();
}
