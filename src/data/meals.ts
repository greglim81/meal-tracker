import { db } from "@/db";
import { meals, mealFoodItems, foodItems } from "@/db/schema";
import { eq, and, gte, lt, sum } from "drizzle-orm";

export type MealWithCalories = {
  id: string;
  name: string;
  eatenAt: Date;
  totalCalories: number;
};

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
