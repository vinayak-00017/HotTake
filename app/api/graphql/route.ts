import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { drizzle } from "drizzle-orm/node-postgres";
import { pool } from "@/lib/db/src/db";
import * as dbSchema from "@/lib/db/src/schema";
import { buildSchema } from "drizzle-graphql";

const db = drizzle(pool, { schema: dbSchema });

const { schema } = buildSchema(db);

const server = new ApolloServer({ schema });

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req: NextRequest) => ({ req }),
});

export { handler as GET, handler as POST };
