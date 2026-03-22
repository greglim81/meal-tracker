# Data Fetching Standards

## Rules

### Server Components Only
All data fetching must be done via **Server Components** exclusively.

- Fetch data directly in `async` Server Components
- Do **not** create route handlers (API routes) for the purpose of fetching data
- Do **not** use `useEffect` + `fetch` or client-side data fetching libraries (SWR, React Query, etc.) to load data

### `/data` Directory for Database Queries
All database queries must be encapsulated in helper functions inside the `/data` directory.

- Create one file per domain entity (e.g., `data/meals.ts`, `data/users.ts`)
- Server Components import and call these helpers directly — never write raw query logic inline in a component
- These helpers must use **Drizzle ORM** to query the database
- **Raw SQL is strictly forbidden** — do not use `db.execute(sql`...`)` or any raw query escape hatch

### Data Authorization
A logged-in user must only be able to access their own data.

- Every query helper that returns user-scoped data must accept a `userId` parameter and filter by it
- Never fetch all rows and filter in application code — always filter at the query level (in the `where` clause)
- Never expose another user's data, even partially

## Example

```ts
// data/meals.ts
import { db } from "@/db"
import { meals } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export async function getMealsForDate(userId: string, date: Date) {
  return db
    .select()
    .from(meals)
    .where(and(eq(meals.userId, userId), eq(meals.date, date)))
}
```

```tsx
// src/app/dashboard/page.tsx (Server Component)
import { getMealsForDate } from "@/data/meals"
import { auth } from "@clerk/nextjs/server"

export default async function DashboardPage() {
  const { userId } = await auth()
  const meals = await getMealsForDate(userId, new Date())
  // ...
}
```

## What Is Allowed vs. Forbidden

| Allowed | Forbidden |
|---|---|
| `async` Server Components fetching data | Route handlers (`app/api/*/route.ts`) for data fetching |
| Helper functions in `/data` using Drizzle ORM | Raw SQL via `db.execute` or template literals |
| Filtering by `userId` in Drizzle `where` clause | Fetching all rows and filtering in JS |
| Passing `userId` from `auth()` into data helpers | Trusting user-supplied IDs without server-side auth |
