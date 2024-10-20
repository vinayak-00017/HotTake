import { sql } from "drizzle-orm";
import {
  AnyPgColumn,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// User SCHEMA
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql.raw("uuid_generate_v4()")),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  username: varchar("username", { length: 50 }).unique().notNull(),
  name: varchar("name", { length: 255 }),
  profilePic: varchar("profilePic", { length: 255 }),
});

// POST SCHEMA
export const userVote = pgEnum("userVote", ["UP", "DOWN"]);

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().default(sql.raw("uuid_generate_v4()")),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  userId: uuid("userId")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("createdAt").default(sql.raw("CURRENT_TIMESTAMP")),
  updatedAt: timestamp("updatedAt").default(sql.raw("CURRENT_TIMESTAMP")),
});

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().default(sql.raw("uuid_generate_v4()")),
  name: varchar("name", { length: 255 }).notNull(),
});

export const postTags = pgTable(
  "post_tags",
  {
    postId: uuid("postId")
      .references(() => posts.id)
      .notNull(),
    tagId: uuid("tagId")
      .references(() => tags.id)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.postId, table.tagId] }),
    };
  }
);

export const postVotes = pgTable("post_votes", {
  id: uuid("id").primaryKey().default(sql.raw("uuid_generate_v4()")),
  postId: uuid("postId").references(() => posts.id),
  userId: uuid("userId").references(() => users.id),
  type: userVote("type").notNull(),
  createdAt: timestamp("createdAt").default(sql.raw("CURRENT_TIMESTAMP")),
});

//Comments schema
export const postComments = pgTable("post_comments", {
  id: uuid("id").primaryKey().default(sql.raw("uuid_generate_v4()")),
  postId: uuid("postId")
    .references(() => posts.id)
    .notNull(),
  userId: uuid("userId")
    .references(() => users.id)
    .notNull(),
  parentId: uuid("parentId").references((): AnyPgColumn => postComments.id),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").default(sql.raw("CURRENT_TIMESTAMP")),
  updatedAt: timestamp("updatedAt").default(sql.raw("CURRENT_TIMESTAMP")),
});

export const commentVotes = pgTable("comment_votes", {
  id: uuid("id").primaryKey().default(sql.raw("uuid_generate_v4()")),
  commentId: uuid("commentId").references(() => postComments.id),
  userId: uuid("userId").references(() => users.id),
  type: userVote("type").notNull(),
  createdAt: timestamp("createdAt").default(sql.raw("CURRENT_TIMESTAMP")),
});
