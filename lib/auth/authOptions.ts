import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { user } from "../db/src/schema";
import { eq } from "drizzle-orm";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "../db/src/db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     username: { label: "Username", type: "text", placeholder: "username" },
    //     email: { label: "Email", type: "text", placeholder: "abc@xyz.com" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials: any) {
    //     const hashedPassword = await bcrypt.hash(credentials?.password, 10);
    //     const existingUser = await db
    //       .select({
    //         email: user.email,
    //         password: user.password,
    //         id: user.id,
    //         username: user.username,
    //       })
    //       .from(user)
    //       .where(eq(user.email, "xyz@abc.com"));

    //     if (existingUser) {
    //       const passwordValidation = await bcrypt.compare(
    //         credentials?.password,
    //         existingUser[0].password
    //       );
    //       if (passwordValidation) {
    //         return {
    //           id: existingUser[0].id,
    //           email: existingUser[0].email,
    //           username: existingUser[0].username,
    //         };
    //       }
    //       return null;
    //     }
    //     try {
    //       const newUser = await db.insert(user).values({
    //         username: credentials.username,
    //         password: hashedPassword,
    //         email: credentials.email,
    //       });
    //       return {
    //         email: credentials.email,
    //         username: credentials.username,
    //       };
    //     } catch (e) {
    //       console.error(e);
    //     }
    //     return null;
    //   },
    // }),
  ],
  adapter: DrizzleAdapter(db),

  // secret: process.env.JWT_SECRET,
  // callbacks: {
  //   async session({ token, session }: any) {
  //     session.user.id = token.sub;

  //     return session;
  //   },
  // },
};
