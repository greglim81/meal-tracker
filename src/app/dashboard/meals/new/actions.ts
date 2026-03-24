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
