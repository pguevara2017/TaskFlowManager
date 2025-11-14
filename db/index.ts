import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL must be set to use database storage");
    }
    const sql = neon(process.env.DATABASE_URL);
    _db = drizzle({ client: sql, schema });
  }
  return _db;
}
