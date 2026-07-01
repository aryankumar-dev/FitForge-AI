"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Salad,
  Dumbbell,
  MessageCircle,
  Users,
  ClipboardList,
  Building2,
  Shield,
  ListChecks,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

const USER_LINKS = [
  { href: "/dashboard/profile", label: "Profile", icon: User, desc: "View & edit your details" },
  { href: "/dashboard/diet", label: "Calories & Diet", icon: Salad, desc: "Your calorie target and meal plan" },
  { href: "/dashboard/workout", label: "Workouts", icon: Dumbbell, desc: "Muscle-specific tutorials & splits" },
  { href: "/dashboard/chat", label: "AI Chat", icon: MessageCircle, desc: "Ask your AI trainer anything" },
  { href: "/dashboard/trainers", label: "Trainers", icon: Users, desc: "Browse & hire certified trainers" },
  { href: "/dashboard/requests", label: "My Requests", icon: ClipboardList, desc: "Track your hire requests" },
  { href: "/dashboard/gyms", label: "Gyms", icon: Building2, desc: "Find top gyms near you" },
];

const TRAINER_LINKS = [
  { href: "/dashboard/profile", label: "Profile", icon: User, desc: "View & edit your trainer profile" },
  { href: "/dashboard/requests", label: "Hire Requests", icon: ClipboardList, desc: "Accept or reject requests" },
];

const ADMIN_LINKS = [
  { href: "/dashboard/admin", label: "Stats", icon: Shield, desc: "Platform overview" },
  { href: "/dashboard/admin/users", label: "Users", icon: Users, desc: "Manage all users" },
  { href: "/dashboard/admin/requests", label: "Hire Requests", icon: ListChecks, desc: "All hire requests" },
];

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user?.role === "admin") {
      api
        .get("/admin/stats")
        .then((res) => setStats(res.data))
        .catch(() => setStats(null));
    }
  }, [user]);

  const links =
    user?.role === "admin" ? ADMIN_LINKS : user?.role === "trainer" ? TRAINER_LINKS : USER_LINKS;

  return (
    <div className="space-y-6">
      <Card className="bg-secondary text-secondary-foreground">
        <CardContent className="flex flex-col gap-2 py-6">
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-secondary-foreground/80">
            {user?.role === "admin"
              ? "Here's what's happening across FitForge AI."
              : user?.role === "trainer"
              ? "Manage your profile and respond to hire requests."
              : "Let's keep pushing towards your fitness goals today."}
          </p>
        </CardContent>
      </Card>

      {user?.role === "admin" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Users" value={stats?.totalUsers ?? 0} />
          <StatCard label="Total Trainers" value={stats?.totalTrainers ?? 0} />
          <StatCard label="Total Hire Requests" value={stats?.totalHireRequests ?? 0} />
          <StatCard label="Pending" value={stats?.pending ?? 0} />
        </div>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold">Quick Links</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <Card className="h-full transition-transform hover:-translate-y-1">
                  <CardHeader className="flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </span>
                      <CardTitle className="text-base">{link.label}</CardTitle>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{link.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <Card>
      <CardContent className="py-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-3xl font-bold text-primary">{value}</p>
      </CardContent>
    </Card>
  );
}
