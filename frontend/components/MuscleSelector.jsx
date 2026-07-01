"use client";

import { cn } from "@/lib/utils";

const MUSCLES = ["chest", "back", "legs", "shoulders", "arms", "abs"];

export default function MuscleSelector({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {MUSCLES.map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium capitalize transition-colors",
            value === m
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input bg-background text-foreground hover:bg-muted"
          )}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
