"use client";

import { useEffect, useState } from "react";
import { Flame, Target, Salad, Loader2 } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";

const MEAL_LABELS = {
  breakfast: "Breakfast",
  midMorningSnack: "Mid-Morning Snack",
  lunch: "Lunch",
  eveningSnack: "Evening Snack",
  dinner: "Dinner",
};

function renderMeal(meal) {
  if (Array.isArray(meal)) {
    return (
      <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        {meal.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }
  return <p className="text-sm text-muted-foreground">{meal}</p>;
}

function DietContent() {
  const [calories, setCalories] = useState(null);
  const [diet, setDiet] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [calRes, dietRes] = await Promise.all([
          api.get("/users/calories"),
          api.get("/users/diet-plan"),
        ]);
        setCalories(calRes.data);
        setDiet(dietRes.data);
      } catch (err) {
        toast({
          title: "Failed to load diet plan",
          description: err.response?.data?.message || "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const meals = diet?.meals || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Calories &amp; Diet</h1>
        <p className="text-muted-foreground">
          Your personalized calorie targets and Indian meal plan.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Flame className="h-5 w-5 text-primary" />
            </span>
            <div>
              <CardDescription>BMR</CardDescription>
              <CardTitle className="text-2xl">{calories?.bmr ?? "-"}</CardTitle>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </span>
            <div>
              <CardDescription>TDEE</CardDescription>
              <CardTitle className="text-2xl">{calories?.tdee ?? "-"}</CardTitle>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Salad className="h-5 w-5 text-primary" />
            </span>
            <div>
              <CardDescription>Calorie Target</CardDescription>
              <CardTitle className="text-2xl">
                {calories?.calorieTarget ?? "-"}
              </CardTitle>
            </div>
          </CardHeader>
        </Card>
      </div>

      {calories?.goal && (
        <div>
          <Badge variant="secondary" className="capitalize">
            Goal: {String(calories.goal).replace(/_/g, " ")}
          </Badge>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Meal Plan</CardTitle>
          <CardDescription>
            {diet?.dietPreference
              ? `Preference: ${diet.dietPreference === "veg" ? "Vegetarian" : "Non-Vegetarian"}`
              : "Personalized meal plan"}
            {diet?.calorieTarget ? ` · Target: ${diet.calorieTarget} kcal` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {Object.keys(MEAL_LABELS).map((key) =>
            meals[key] ? (
              <div key={key} className="rounded-xl border p-4">
                <h3 className="mb-2 font-semibold text-primary">
                  {MEAL_LABELS[key]}
                </h3>
                {renderMeal(meals[key])}
              </div>
            ) : null
          )}
          {Object.keys(meals).length === 0 && (
            <p className="text-sm text-muted-foreground">
              No meal plan available yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function DietPage() {
  return (
    <RequireAuth allowedRoles={["user"]}>
      <DietContent />
    </RequireAuth>
  );
}
