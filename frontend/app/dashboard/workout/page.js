"use client";

import { useEffect, useState } from "react";
import { Loader2, Youtube } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import MuscleSelector from "@/components/MuscleSelector";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";

function WorkoutContent() {
  const [muscle, setMuscle] = useState("chest");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      try {
        const res = await api.get("/users/workout-plan", { params: { muscle } });
        setData(res.data);
      } catch (err) {
        toast({
          title: "Failed to load workout plan",
          description: err.response?.data?.message || "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muscle]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Workouts</h1>
        <p className="text-muted-foreground">
          Pick a muscle group to see tutorials and a 5-day split.
        </p>
      </div>

      <MuscleSelector value={muscle} onChange={setMuscle} />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 capitalize">
                <Youtube className="h-5 w-5 text-destructive" />
                {muscle} Tutorials
              </CardTitle>
              <CardDescription>Curated video tutorials</CardDescription>
            </CardHeader>
            <CardContent>
              {data?.tutorials?.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.tutorials.map((t, i) => (
                    <div key={i} className="space-y-2">
                      <div className="aspect-video overflow-hidden rounded-lg border">
                        <iframe
                          className="h-full w-full"
                          src={`https://www.youtube.com/embed/${t.youtubeId}`}
                          title={t.title}
                          allowFullScreen
                        />
                      </div>
                      <p className="text-sm font-medium">{t.title}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No tutorials available.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="capitalize">5-Day {muscle} Split</CardTitle>
              <CardDescription>Structured weekly plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {data?.fiveDaySplit?.length ? (
                data.fiveDaySplit.map((day, i) => (
                  <div key={i}>
                    <h3 className="mb-2 font-semibold text-primary">
                      {day.day} — {day.focus}
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Exercise</TableHead>
                          <TableHead>Sets</TableHead>
                          <TableHead>Reps</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {day.exercises?.map((ex, j) => (
                          <TableRow key={j}>
                            <TableCell>{ex.name}</TableCell>
                            <TableCell>{ex.sets}</TableCell>
                            <TableCell>{ex.reps}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No split plan available.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export default function WorkoutPage() {
  return (
    <RequireAuth allowedRoles={["user"]}>
      <WorkoutContent />
    </RequireAuth>
  );
}
