import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.log("no database url");
}

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export default db;
