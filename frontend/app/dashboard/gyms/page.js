"use client";

import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import GymCard from "@/components/GymCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";

function GymsContent() {
  const [gyms, setGyms] = useState([]);
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGyms = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get("/gyms", { params: area ? { area } : {} });
      setGyms(Array.isArray(res.data) ? res.data : res.data?.gyms || []);
    } catch (err) {
      toast({
        title: "Failed to load gyms",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGyms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gyms</h1>
        <p className="text-muted-foreground">Find top-rated gyms near you.</p>
      </div>

      <form onSubmit={fetchGyms} className="flex max-w-md items-center gap-2">
        <Input
          placeholder="Search by area..."
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
        <Button type="submit">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </form>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : gyms.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gyms.map((gym) => (
            <GymCard key={gym._id} gym={gym} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No gyms found.</p>
      )}
    </div>
  );
}

export default function GymsPage() {
  return (
    <RequireAuth allowedRoles={["user"]}>
      <GymsContent />
    </RequireAuth>
  );
}
