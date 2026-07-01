"use client";

import { useEffect, useState } from "react";
import { Loader2, Users, UserCog, ClipboardList, Clock, CheckCircle2, XCircle } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";

const STAT_CARDS = [
  { key: "totalUsers", label: "Total Users", icon: Users },
  { key: "totalTrainers", label: "Total Trainers", icon: UserCog },
  { key: "totalHireRequests", label: "Total Hire Requests", icon: ClipboardList },
  { key: "pending", label: "Pending", icon: Clock },
  { key: "accepted", label: "Accepted", icon: CheckCircle2 },
  { key: "rejected", label: "Rejected", icon: XCircle },
];

function AdminStatsContent() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data || {});
      } catch (err) {
        toast({
          title: "Failed to load stats",
          description: err.response?.data?.message || "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform Overview</h1>
        <p className="text-muted-foreground">
          Key metrics across FitForge AI.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STAT_CARDS.map(({ key, label, icon: Icon }) => (
          <Card key={key}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.[key] ?? 0}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function AdminStatsPage() {
  return (
    <RequireAuth allowedRoles={["admin"]}>
      <AdminStatsContent />
    </RequireAuth>
  );
}
