import { db } from "@/db";
import { meals, mealFoodItems, foodItems } from "@/db/schema";
import { eq, and, gte, lt, sum } from "drizzle-orm";

export async function createMeal(
  userId: string,
  name: string,
  eatenAt: Date
): Promise<void> {
  await db.insert(meals).values({ userId, name, eatenAt });
}

export type MealWithCalories = {
  id: string;
  name: string;
  eatenAt: Date;
  totalCalories: number;
};

export type Meal = {
  id: string;
  name: string;
  eatenAt: Date;
};

export async function getMealById(
  userId: string,
  mealId: string
): Promise<Meal | null> {
  const rows = await db
    .select({ id: meals.id, name: meals.name, eatenAt: meals.eatenAt })
    .from(meals)
    .where(and(eq(meals.id, mealId), eq(meals.userId, userId)))
    .limit(1);

  return rows[0] ?? null;
}

export async function updateMeal(
  userId: string,
  mealId: string,
  name: string,
  eatenAt: Date
): Promise<void> {
  await db
    .update(meals)
    .set({ name, eatenAt, updatedAt: new Date() })
    .where(and(eq(meals.id, mealId), eq(meals.userId, userId)));
}

export async function getMealsForDate(
  userId: string,
  date: Date
): Promise<MealWithCalories[]> {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const rows = await db
    .select({
      id: meals.id,
      name: meals.name,
      eatenAt: meals.eatenAt,
      totalCalories: sum(foodItems.calories),
    })
    .from(meals)
    .leftJoin(mealFoodItems, eq(mealFoodItems.mealId, meals.id))
    .leftJoin(foodItems, eq(foodItems.id, mealFoodItems.foodItemId))
    .where(
      and(
        eq(meals.userId, userId),
        gte(meals.eatenAt, start),
        lt(meals.eatenAt, end)
      )
    )
    .groupBy(meals.id, meals.name, meals.eatenAt);

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    eatenAt: row.eatenAt,
    totalCalories: Number(row.totalCalories ?? 0),
  }));
}
