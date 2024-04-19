import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { users } from "../db/src/schema";
import { eq, or } from "drizzle-orm";
import GoogleProvider from "next-auth/providers/google";
import db from "../db/src/db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usernameOrEmail: { label: "Username / Email", type: "text" },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials: any) {
        const hashedPassword = await bcrypt.hash(credentials?.password, 10);
        try {
          const existingUser = await db
            .select({
              email: users.email,
              password: users.password,
              id: users.id,
              username: users.username,
            })
            .from(users)
            .where(
              or(
                eq(users.email, credentials.usernameOrEmail),
                eq(users.username, credentials.usernameOrEmail)
              )
            );
          if (existingUser) {
            if (!existingUser[0].password) {
              return null;
            }
            const passwordValidation = await bcrypt.compare(
              credentials?.password,
              existingUser[0].password
            );
            if (passwordValidation) {
              return {
                id: existingUser[0].id,
                email: existingUser[0].email,
                username: existingUser[0].username,
              };
            }
            return null;
          }
        } catch (err) {
          console.error(err);
          return null;
        }

        // try {
        //   const newUser = await db.insert(user).values({
        //     username: credentials.username,
        //     password: hashedPassword,
        //     email: credentials.email,
        //   });
        //   return {
        //     email: credentials.email,
        //     username: credentials.username,
        //   };
        // } catch (e) {
        //   console.error(e);
        // }
        return null;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }: any) {
      if (account.provider === "google") {
        try {
          const { email, name } = user;
          const ifUserExists = await db
            .select({
              email: users.email,
              id: users.id,
            })
            .from(users)
            .where(eq(users.email, email));

          if (ifUserExists.length === 0) {
            await db.insert(users).values({
              name: name,
              email: email,
            });
          }
        } catch (err) {
          console.error(err);
        }
      }
      return user;
    },
    // async jwt({ token, existingUser }: any) {
    //   if (user) {
    //     token.username = existingUser.username;
    //   }
    // },

    async session({ token, session }: any) {
      session.user.id = token.sub;
      session.user.username = token.username;

      return session;
    },
  },
};
