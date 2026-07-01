"use client";

import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import TrainerCard from "@/components/TrainerCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";

function TrainersContent() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialization, setSpecialization] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const { toast } = useToast();

  const fetchTrainers = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const params = {};
      if (specialization) params.specialization = specialization;
      if (minExperience) params.minExperience = minExperience;
      const res = await api.get("/trainers", { params });
      setTrainers(Array.isArray(res.data) ? res.data : res.data?.trainers || []);
    } catch (err) {
      toast({
        title: "Failed to load trainers",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Trainers</h1>
        <p className="text-muted-foreground">
          Browse certified trainers and send a hire request.
        </p>
      </div>

      <form
        onSubmit={fetchTrainers}
        className="flex flex-wrap items-end gap-4 rounded-xl border bg-card p-4"
      >
        <div className="space-y-2">
          <Label htmlFor="specialization">Specialization</Label>
          <Input
            id="specialization"
            placeholder="e.g. Yoga"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-48"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minExperience">Min. Experience (yrs)</Label>
          <Input
            id="minExperience"
            type="number"
            placeholder="e.g. 2"
            value={minExperience}
            onChange={(e) => setMinExperience(e.target.value)}
            className="w-40"
          />
        </div>
        <Button type="submit">
          <Search className="mr-2 h-4 w-4" /> Filter
        </Button>
      </form>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : trainers.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trainers.map((trainer) => (
            <TrainerCard key={trainer._id} trainer={trainer} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No trainers found.</p>
      )}
    </div>
  );
}

export default function TrainersPage() {
  return (
    <RequireAuth allowedRoles={["user"]}>
      <TrainersContent />
    </RequireAuth>
  );
}
