# Data Mutation Standards

## Rules

### Helper Functions in `/data` for Database Calls
All database mutations must be encapsulated in helper functions inside the `src/data` directory.

- Create one file per domain entity (e.g., `data/meals.ts`, `data/users.ts`)
- Server Actions import and call these helpers — never write raw Drizzle calls inline in an action
- Helpers must use **Drizzle ORM** exclusively — raw SQL via `db.execute` or template literals is forbidden

### Server Actions for All Mutations
All data mutations must be performed via **Server Actions** located in co-located `actions.ts` files.

- Place `actions.ts` alongside the page or component that uses it (e.g., `src/app/meals/new/actions.ts`)
- Every `actions.ts` file must begin with the `"use server"` directive
- Do not perform mutations in route handlers (`app/api/*/route.ts`) or directly in components

### Explicit TypeScript Types — No FormData
Server Actions must accept explicitly typed parameters. `FormData` is forbidden as a parameter type.

- Define a typed argument for every parameter the action accepts
- Use TypeScript primitive types or imported types — never `FormData`, `any`, or `unknown`

### Zod Validation Required
Every Server Action must validate its arguments with **Zod** before performing any mutation.

- Define a Zod schema for the action's input
- Parse and validate at the top of the action body before any logic runs
- Throw or return a structured error if validation fails — never proceed with invalid input

## Example

```ts
// src/data/meals.ts
import { db } from "@/db";
import { meals } from "@/db/schema";

export async function createMeal(
  userId: string,
  name: string,
  eatenAt: Date
): Promise<void> {
  await db.insert(meals).values({ userId, name, eatenAt });
}
```

```ts
// src/app/meals/new/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createMeal } from "@/data/meals";

const CreateMealSchema = z.object({
  name: z.string().min(1, "Meal name is required"),
  eatenAt: z.coerce.date(),
});

export async function createMealAction(input: {
  name: string;
  eatenAt: string;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const parsed = CreateMealSchema.parse(input);

  await createMeal(userId, parsed.name, parsed.eatenAt);

  redirect("/dashboard");
}
```

## What Is Allowed vs. Forbidden

| Allowed | Forbidden |
|---|---|
| Helper functions in `src/data` using Drizzle ORM | Inline Drizzle calls inside Server Actions or components |
| Server Actions in co-located `actions.ts` files | Mutations in route handlers or client components |
| Explicitly typed action parameters | `FormData`, `any`, or `unknown` as parameter types |
| Zod validation at the top of every Server Action | Proceeding with unvalidated input |
| Raw SQL via `db.execute` or template literals | |
