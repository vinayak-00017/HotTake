import db from "@/lib/db/src/db";
import {
  postComments,
  posts,
  postTags,
  postVotes,
  tags,
  users,
} from "@/lib/db/src/schema";
import { and, desc, eq, gt, sql } from "drizzle-orm";

export const resolvers = {
  Query: {
    async users() {
      return await db.select().from(users);
    },
    async posts() {
      return await db.select().from(posts);
    },
    async user(_: any, args: any) {
      const result = await db.select().from(users).where(eq(users.id, args.id));
      return result[0];
    },
    async post(_: any, args: any) {
      const result = await db.select().from(posts).where(eq(posts.id, args.id));
      return result[0];
    },
    // async infinitePosts(
    //   _: any,
    //   { first, after }: { first: any; after: any },
    //   { db }: { db: any }
    // ) {
    //   // Limit the number of posts to a maximum of 5
    //   const limit = Math.min(first || 5, 5);

    //   // Parse the cursor
    //   let cursorCondition = undefined;
    //   if (after) {
    //     const [cursorId, cursorDate] = after.split("_");
    //     cursorCondition = and(
    //       gt(posts.createdAt, new Date(parseInt(cursorDate))),
    //       gt(posts.id, cursorId)
    //     );
    //   }

    //   // Fetch posts
    //   const fetchedPosts = await db
    //     .select()
    //     .from(posts)
    //     .where(cursorCondition)
    //     .orderBy(desc(posts.createdAt), desc(posts.id))
    //     .limit(limit + 1) // Fetch one extra to determine if there's a next page
    //     .leftJoin(users, eq(posts.userId, users.id))
    //     .leftJoin(postTags, eq(posts.id, postTags.postId))
    //     .leftJoin(tags, eq(postTags.tagId, tags.id))
    //     .leftJoin(postVotes, eq(posts.id, postVotes.postId))
    //     .leftJoin(postComments, eq(posts.id, postComments.postId));

    //   // Group the results
    //   const groupedPosts = fetchedPosts.reduce((acc: any, row: any) => {
    //     if (!acc[row.posts.id]) {
    //       acc[row.posts.id] = {
    //         ...row.posts,
    //         user: row.users,
    //         tags: [],
    //         postVotes: [],
    //         postComments: [],
    //       };
    //     }
    //     if (row.tags) acc[row.posts.id].tags.push(row.tags);
    //     if (row.postVotes) acc[row.posts.id].postVotes.push(row.postVotes);
    //     if (row.postComments)
    //       acc[row.posts.id].postComments.push(row.postComments);
    //     return acc;
    //   }, {});

    //   const items = Object.values(groupedPosts);

    //   // Check if there's a next page
    //   const hasNextPage = items.length > limit;
    //   const edges = items.slice(0, limit).map((item: any) => ({
    //     cursor: `${item.id}_${item.createdAt.getTime()}`,
    //     node: {
    //       ...item,
    //       commentCount: item.postComments.length,
    //       totalVotes: item.postVotes.reduce(
    //         (acc: any, vote: any) => acc + (vote.type === "UP" ? 1 : -1),
    //         0
    //       ),
    //     },
    //   }));

    //   return {
    //     edges,
    //     pageInfo: {
    //       endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
    //       hasNextPage,
    //     },
    //   };
    // },
  },

  Posts: {
    async user(parent: any) {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, parent.userId));
      return result[0];
    },

    async postComments(parent: any) {
      const result = await db
        .select()
        .from(postComments)
        .where(eq(postComments.postId, parent.id));
      return result;
    },
    async totalVotes(parent: any) {
      const result = await db
        .select({
          totalVotes: sql`COALESCE(SUM(
            CASE
              WHEN ${postVotes.type} = 'UP' THEN 1
              WHEN ${postVotes.type} = 'DOWN' THEN -1
              ELSE 0
            END
          ), 0)`.mapWith(Number),
        })
        .from(postVotes)
        .where(eq(postVotes.postId, parent.id));
      return result[0].totalVotes;
    },
    async commentCount(parent: any) {
      const result = await db
        .select({
          count: sql`COUNT(${postComments.id})`.mapWith(Number),
        })
        .from(postComments)
        .where(eq(postComments.postId, parent.id));
      return result[0].count;
    },
  },

  Users: {
    async postComments(parent: any) {
      const result = await db
        .select()
        .from(postComments)
        .where(eq(postComments.userId, parent.id));
      return result;
    },

    async posts(parent: any) {
      const result = await db
        .select()
        .from(posts)
        .where(eq(posts.userId, parent.id));
      return result;
    },
  },
};
