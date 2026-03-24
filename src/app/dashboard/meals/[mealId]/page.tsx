import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getMealById } from "@/data/meals";
import EditMealForm from "./EditMealForm";

export default async function EditMealPage({
  params,
}: {
  params: Promise<{ mealId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { mealId } = await params;
  const meal = await getMealById(userId, mealId);
  if (!meal) notFound();

  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      <h1 className="text-2xl font-semibold mb-6">Edit Meal</h1>
      <EditMealForm meal={meal} />
    </div>
  );
}
