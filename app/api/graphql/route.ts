import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { gql } from "graphql-tag";

const typeDefs = `#graphql
  type users {
    id: ID!
     email: String!
  password: String
  username: String!
  name: String
  profilePic: String
  }  

type Query {
    users: [User!]!
  user(id: ID!): User
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req: NextRequest) => ({ req }),
});

export { handler as GET, handler as POST };
