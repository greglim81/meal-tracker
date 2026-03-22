"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MOCK_MEALS: Record<string, { id: number; name: string; calories: number; time: string }[]> = {
  "2026-03-23": [
    { id: 1, name: "Oatmeal with berries", calories: 320, time: "8:00 AM" },
    { id: 2, name: "Grilled chicken salad", calories: 480, time: "12:30 PM" },
    { id: 3, name: "Salmon with roasted vegetables", calories: 560, time: "6:45 PM" },
  ],
};

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date("2026-03-23"));
  const [open, setOpen] = useState(false);

  const dateKey = date ? format(date, "yyyy-MM-dd") : "";
  const meals = MOCK_MEALS[dateKey] ?? [];

  return (
    <div className="container mx-auto max-w-2xl py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Meal Tracker</h1>

      <div className="mb-6">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                if (d) {
                  setDate(d);
                  setOpen(false);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Meals for {date ? format(date, "MMMM d, yyyy") : "—"}
          </CardTitle>
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
                    <p className="text-sm text-muted-foreground">{meal.time}</p>
                  </div>
                  <span className="text-sm font-medium">{meal.calories} cal</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
