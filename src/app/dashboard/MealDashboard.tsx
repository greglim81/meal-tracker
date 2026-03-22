"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MealWithCalories } from "@/data/meals";

type Props = {
  date: Date;
  meals: MealWithCalories[];
};

export default function MealDashboard({ date, meals }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleDateSelect(d: Date | undefined) {
    if (!d) return;
    setOpen(false);
    router.push(`/dashboard?date=${format(d, "yyyy-MM-dd")}`);
  }

  return (
    <div className="container mx-auto max-w-2xl py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Meal Tracker</h1>

      <div className="mb-6">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-60 justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meals for {format(date, "MMMM d, yyyy")}</CardTitle>
        </CardHeader>
        <CardContent>
          {meals.length === 0 ? (
            <p className="text-sm text-muted-foreground">No meals logged for this day.</p>
          ) : (
            <ul className="divide-y">
              {meals.map((meal) => (
                <li key={meal.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{meal.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(meal.eatenAt), "h:mm a")}
                    </p>
                  </div>
                  <span className="text-sm font-medium">{meal.totalCalories} cal</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
