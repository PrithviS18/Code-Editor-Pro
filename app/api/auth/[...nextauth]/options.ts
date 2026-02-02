/*Import NextAuth types for configuring authentication options*/
import { NextAuthOptions } from "next-auth";

/*Import Credentials provider to allow email/password login*/
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/config/connectDB";
import UserModel from "@/models/User";

/* -------------------------------------------------------------------------- */
/*                   TYPE AUGMENTATION FOR NEXTAUTH SESSION                    */
/* -------------------------------------------------------------------------- */

/*
  Extend NextAuth Session type to include custom fields.
  This allows TypeScript to recognize `session.user.id`
  and `session.user.subscription`.
*/
declare module "next-auth" {
  interface User {
    subscription?: boolean;
  }

  interface Session {
    user: {
      id?: string;
      subscription?: boolean;
    };
  }
}

/*
  Extend JWT type to store custom properties inside the token.
  These values are later copied into the session.
*/
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    subscription?: boolean;
  }
}

/* -------------------------------------------------------------------------- */
/*                          NEXTAUTH CONFIGURATION                             */
/* -------------------------------------------------------------------------- */

export const authOptions: NextAuthOptions = {
  /*
    Define authentication providers.
    Here we are using Credentials (email + password).
  */
  providers: [
    CredentialsProvider({
      /*Provider name shown in NextAuth*/
      name: "Credentials",

      /*Define fields expected from the login form
      */
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      /*
        authorize() is called when a user tries to log in.
        It must return a user object if authentication succeeds,
        or throw an error if it fails.
      */
      async authorize(credentials) {
        /*
          Validate input before querying database
        */
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        /*
          Ensure database connection exists
        */
        await connectDB();

        /*
          Find user by email.
          `.select("+password")` ensures password is included
          even if it is excluded by default in schema.
        */
        const user = await UserModel
          .findOne({ email: credentials.email });

        /*
          If no user found, reject login
        */
        if (!user) {
          throw new Error("No user found with this email");
        }

        /*
          Compare provided password with hashed password in DB
        */
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        /*
          Reject login if password is incorrect
        */
        if (!isPasswordValid) {
          throw new Error("Incorrect password");
        }

        /*
          Return minimal user data.
          This object becomes available in JWT callback.
        */
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.picture || "",
          subscription: user.subscription || false,
        };
      },
    }),
  ],

  /* ------------------------------------------------------------------------ */
  /*                                CALLBACKS                                 */
  /* ------------------------------------------------------------------------ */

  callbacks: {
    /*
      jwt callback runs whenever a JWT is created or updated.
      Here we store custom fields inside the token.
    */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.subscription = user.subscription;
      }
      return token;
    },

    /*
      session callback runs whenever session is accessed.
      It transfers data from JWT to session object.
    */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.subscription = token.subscription as boolean;
      }
      return session;
    },
  },

  /* ------------------------------------------------------------------------ */
  /*                            CUSTOM AUTH PAGES                              */
  /* ------------------------------------------------------------------------ */

  pages: {
    /*
      Custom login page
    */
    signIn: "/login",

    /*
      Redirect errors to login page
    */
    error: "/login",
  },

  /* ------------------------------------------------------------------------ */
  /*                              SESSION CONFIG                               */
  /* ------------------------------------------------------------------------ */

  session: {
    /*
      Use JWT strategy instead of database sessions
    */
    strategy: "jwt",

    /*
      Session expiration time (30 days)
    */
    maxAge: 30 * 24 * 60 * 60,
  },

  /*
    Secret used to sign JWT tokens
  */
  secret: process.env.NEXTAUTH_SECRET,
};
