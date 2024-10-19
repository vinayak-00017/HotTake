import db from "@/lib/db/src/db";
import { posts, users } from "@/lib/db/src/schema";
import { eq } from "drizzle-orm";

export const resolvers = {
  Query: {
    users() {
      return db.select().from(users);
    },
    posts() {
      return db.select().from(posts);
    },
    user(_: any, args: any) {
      return db.select().from(users).where(eq(users.id, args.id));
    },
  },
};
