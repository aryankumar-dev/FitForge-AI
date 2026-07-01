"use client";

import { Star, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function GymCard({ gym }) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="h-40 w-full bg-muted">
        {gym.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={gym.image}
            alt={gym.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col gap-2 pt-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold">{gym.name}</h3>
          <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-semibold shrink-0">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            {gym.rating ?? "N/A"}
          </div>
        </div>
        <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            {gym.address ? `${gym.address}, ` : ""}
            {gym.area}
          </span>
        </div>
        {gym.contact && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0" />
            <span>{gym.contact}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
