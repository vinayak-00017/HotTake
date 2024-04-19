import { config } from "dotenv";
import { users } from "./schema";
import db from "./db";
import bcrypt from "bcrypt";

config({ path: ".env" });

async function seed() {
  const password = await bcrypt.hash("ff", 10);
  await db.insert(users).values({
    email: "f@f.com",
    username: "ff",
    password,
    name: "ea3y",
  });
}

async function main() {
  try {
    await seed();
    console.log("Seeding completed");
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

main();
