import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMealsForDate } from "@/data/meals";
import MealDashboard from "./MealDashboard";

type Props = {
  searchParams: Promise<{ date?: string }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { date: dateParam } = await searchParams;
  const date = dateParam ? new Date(dateParam) : new Date();

  const meals = await getMealsForDate(userId, date);

  return <MealDashboard date={date} meals={meals} />;
}
