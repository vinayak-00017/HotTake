// import {
//   timestamp,
//   pgTable,
//   text,
//   primaryKey,
//   integer,
// } from "drizzle-orm/pg-core";
// import type { AdapterAccount } from "next-auth/adapters";

import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// export const user = pgTable("user", {
//   id: text("id").notNull().primaryKey(),
//   name: text("name"),
//   email: text("email").notNull(),
//   emailVerified: timestamp("emailVerified", { mode: "date" }),
//   image: text("image"),
//   password: text("password"),
//   username: text("username"),
// });

// export const accounts = pgTable(
//   "account",
//   {
//     userId: text("userId")
//       .notNull()
//       .references(() => user.id, { onDelete: "cascade" }),
//     type: text("type").$type<AdapterAccount["type"]>().notNull(),
//     provider: text("provider").notNull(),
//     providerAccountId: text("providerAccountId").notNull(),
//     refresh_token: text("refresh_token"),
//     access_token: text("access_token"),
//     expires_at: integer("expires_at"),
//     token_type: text("token_type"),
//     scope: text("scope"),
//     id_token: text("id_token"),
//     session_state: text("session_state"),
//   },
//   (account) => ({
//     compoundKey: primaryKey({
//       columns: [account.provider, account.providerAccountId],
//     }),
//   })
// );

// export const sessions = pgTable("session", {
//   sessionToken: text("sessionToken").notNull().primaryKey(),
//   userId: text("userId")
//     .notNull()
//     .references(() => user.id, { onDelete: "cascade" }),
//   expires: timestamp("expires", { mode: "date" }).notNull(),
// });

// export const verificationTokens = pgTable(
//   "verificationToken",
//   {
//     identifier: text("identifier").notNull(),
//     token: text("token").notNull(),
//     expires: timestamp("expires", { mode: "date" }).notNull(),
//   },
//   (vt) => ({
//     compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
//   })
// );

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql.raw("uuid_generate_v4()")),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  username: varchar("username", { length: 50 }).unique(),
  name: varchar("name", { length: 255 }),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().default(sql.raw("uuid_generate_v4()")),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  userId: uuid("userId").references(() => users.id),
  createdAt: timestamp("createdAt").default(sql.raw("CURRENT_TIMESTAMP")),
  updatedAt: timestamp("updatedAt").default(sql.raw("CURRENT_TIMESTAMP")),
});

export const votes = pgTable("votes", {
  id: uuid("id").primaryKey().default(sql.raw("uuid_generate_v4()")),
  postId: uuid("postId").references(() => posts.id),
  userId: uuid("userId").references(() => users.id),
  type: varchar("type", { length: 10 }).notNull(), // 'upvote' or 'downvote'
  createdAt: timestamp("createdAt").default(sql.raw("CURRENT_TIMESTAMP")),
});

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().default(sql.raw("uuid_generate_v4()")),
  postId: uuid("postId").references(() => posts.id),
  userId: uuid("userId").references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").default(sql.raw("CURRENT_TIMESTAMP")),
  updatedAt: timestamp("updatedAt").default(sql.raw("CURRENT_TIMESTAMP")),
});
