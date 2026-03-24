# Authentication Standards

## Rule

**This app uses Clerk exclusively for authentication.** Do not implement custom auth, session handling, or use any other authentication library.

## What This Means

- Use `@clerk/nextjs/server` to access the authenticated user in Server Components and Server Actions
- Use `@clerk/nextjs` for client-side Clerk utilities (e.g. `SignInButton`, `UserButton`)
- Never trust a user-supplied ID for identifying the current user — always derive `userId` from `auth()` on the server
- Always guard protected routes and actions by checking `userId` from `auth()` and redirecting to `/` if unauthenticated

## Getting the Current User

In Server Components and Server Actions, get the authenticated user via:

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
if (!userId) redirect("/");
```

Never pass `userId` from the client — always call `auth()` server-side.

## What Is Allowed vs. Forbidden

| Allowed | Forbidden |
|---|---|
| `auth()` from `@clerk/nextjs/server` | Custom session/token logic |
| Clerk UI components (`SignInButton`, `UserButton`) | Other auth libraries (NextAuth, Auth.js, etc.) |
| Redirecting unauthenticated users server-side | Trusting client-supplied user IDs |
| Middleware via `clerkMiddleware` | Hand-rolled middleware for auth |
