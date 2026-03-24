"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateMealAction } from "./actions";
import type { Meal } from "@/data/meals";

export default function EditMealForm({ meal }: { meal: Meal }) {
  const router = useRouter();
  const [name, setName] = useState(meal.name);
  const [eatenAt, setEatenAt] = useState(
    new Date(meal.eatenAt).toISOString().slice(0, 16)
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await updateMealAction(meal.id, { name, eatenAt });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Meal name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Breakfast"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="eatenAt">Date &amp; time</Label>
        <Input
          id="eatenAt"
          type="datetime-local"
          value={eatenAt}
          onChange={(e) => setEatenAt(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2 mt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
