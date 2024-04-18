import { migrate } from "drizzle-orm/neon-http/migrator";
import db from "./db";

const migrateDb = async () => {
  try {
    console.log("Migrating client");
    await migrate(db, { migrationsFolder: "./lib/db/migrations" });
    console.log("Successfully migrated");
  } catch (err) {
    console.log("Error migrating client", err);
    process.exit(1);
  }
};

migrateDb();
