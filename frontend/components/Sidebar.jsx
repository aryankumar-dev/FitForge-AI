"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Salad,
  Dumbbell,
  MessageCircle,
  Users,
  ClipboardList,
  Building2,
  Shield,
  ListChecks,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_BY_ROLE = {
  user: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/diet", label: "Calories & Diet", icon: Salad },
    { href: "/dashboard/workout", label: "Workouts", icon: Dumbbell },
    { href: "/dashboard/chat", label: "AI Chat", icon: MessageCircle },
    { href: "/dashboard/trainers", label: "Trainers", icon: Users },
    { href: "/dashboard/requests", label: "My Requests", icon: ClipboardList },
    { href: "/dashboard/gyms", label: "Gyms", icon: Building2 },
  ],
  trainer: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/requests", label: "Hire Requests", icon: ClipboardList },
  ],
  admin: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin", label: "Stats", icon: Shield },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/requests", label: "Hire Requests", icon: ListChecks },
  ],
};

export default function Sidebar({ role }) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role] || NAV_BY_ROLE.user;

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b px-6 font-bold text-lg">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Dumbbell className="h-5 w-5 text-primary-foreground" />
        </span>
        FitForge <span className="text-primary">AI</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
