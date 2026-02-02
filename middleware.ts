/*
  Import NextResponse to handle redirects and responses
  inside Next.js middleware.
*/
import { NextResponse } from "next/server";

/*
  withAuth is a helper from NextAuth that wraps middleware
  and automatically attaches authentication data (JWT token).
*/
import { withAuth } from "next-auth/middleware";

/*
  Export the middleware wrapped with NextAuth authentication logic.
*/
export default withAuth(
  /*
    This function runs on every request that matches the `matcher`.
    It executes AFTER NextAuth processes the authentication token.
  */
  function middleware(req) {

    /*
      Extract the authentication token from the request.
      If the user is logged in, `token` will exist.
      If not logged in, `token` will be null.
    */
    const token = req.nextauth.token;

    /*
      If the user IS logged in and tries to access
      the login or register page, redirect them to home page.
      This prevents logged-in users from seeing auth pages again.
    */
    if (
      token &&
      (req.nextUrl.pathname === "/login" ||
        req.nextUrl.pathname === "/register")
    ) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    /*
      If no redirect is needed, allow the request to continue.
    */
    return NextResponse.next();
  },

  /*
    Configuration object for NextAuth middleware.
  */
  {
    callbacks: {
      /*
        The authorized callback decides whether the request
        is allowed to proceed or not.
      */
      authorized({ token, req }) {
        const pathname = req.nextUrl.pathname;

        /*
          Always allow access to login and register pages,
          even if the user is not authenticated.
        */
        if (pathname === "/login" || pathname === "/register") {
          return true;
        }

        /*
          For all other matched routes,
          allow access ONLY if the user is authenticated.
        */
        return !!token;
      },
    },
  }
);

/*
  Configuration for which routes this middleware applies to.
  The middleware will ONLY run for these paths.
*/
export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard",
  ],
};
