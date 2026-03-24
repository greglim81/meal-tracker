"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { updateMeal } from "@/data/meals";

const UpdateMealSchema = z.object({
  name: z.string().min(1, "Meal name is required"),
  eatenAt: z.coerce.date(),
});

export async function updateMealAction(
  mealId: string,
  input: { name: string; eatenAt: string }
) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const parsed = UpdateMealSchema.parse(input);

  await updateMeal(userId, mealId, parsed.name, parsed.eatenAt);

  redirect("/dashboard");
}
