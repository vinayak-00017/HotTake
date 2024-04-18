import { config } from "dotenv";
import { user } from "./schema";
import db from "./db";
import bcrypt from "bcrypt";

config({ path: ".env" });

// async function seed() {
//   const password = await bcrypt.hash("f", 10);
//   await db.insert(user).values({
//     email: "a@b.com",
//     password,
//   });
// }

// async function main() {
//   try {
//     await seed();
//     console.log("Seeding completed");
//   } catch (error) {
//     console.error("Error during seeding:", error);
//     process.exit(1);
//   }
// }

// main();
