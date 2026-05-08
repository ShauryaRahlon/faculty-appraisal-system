import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's custom role. */
      role?: string
      department?: string
      employeeCode?: string
      id?: string
    } & DefaultSession["user"]
  }

  interface User {
    role?: string
    department?: string
    employeeCode?: string
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    role?: string
    department?: string
    code?: string
    id?: string
  }
}
