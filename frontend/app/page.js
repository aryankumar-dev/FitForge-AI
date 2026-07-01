import Link from "next/link";
import {
  Dumbbell,
  MessageCircleHeart,
  Salad,
  Youtube,
  Users,
  Building2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const FEATURES = [
  {
    icon: MessageCircleHeart,
    title: "AI Health Chat",
    description:
      "Ask anything about fitness, recovery, or nutrition and get instant, personalized guidance from our AI trainer.",
  },
  {
    icon: Salad,
    title: "Indian Diet Plans",
    description:
      "Get calorie targets and full-day meal plans tailored to Indian vegetarian and non-vegetarian preferences.",
  },
  {
    icon: Youtube,
    title: "Muscle-Specific Tutorials",
    description:
      "Pick a muscle group and get curated video tutorials plus a structured 5-day workout split.",
  },
  {
    icon: Users,
    title: "Hire a Trainer",
    description:
      "Browse certified trainers by specialization and experience, and send a hire request in seconds.",
  },
  {
    icon: Building2,
    title: "Top Gyms Near You",
    description:
      "Discover highly-rated gyms in your area with contact details and ratings at a glance.",
  },
  {
    icon: Dumbbell,
    title: "All-In-One Platform",
    description:
      "Track your profile, goals, and progress in a single, clean dashboard built for consistency.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <section className="relative overflow-hidden bg-secondary text-secondary-foreground">
        <div className="container flex flex-col items-center gap-8 py-24 text-center">
          <span className="rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Powered by AI
          </span>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Meet <span className="text-primary">FitForge AI</span> — your
            personal AI gym trainer
          </h1>
          <p className="max-w-2xl text-lg text-secondary-foreground/80">
            Personalized diet plans, muscle-specific workouts, an AI chat
            coach, and real trainers &amp; gyms — all in one platform built to
            get you results.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/register">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 bg-transparent text-secondary-foreground hover:bg-white/10"
            >
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="container py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything you need to reach your goals
          </h2>
          <p className="mt-3 text-muted-foreground">
            One platform. Diet, workouts, AI coaching, trainers, and gyms.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title} className="transition-transform hover:-translate-y-1">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="about" className="bg-muted/50 py-20">
        <div className="container flex flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to forge a stronger you?
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Create your free account, set your goals, and let FitForge AI
            build the plan — or connect you with the trainer — that fits you.
          </p>
          <Button asChild size="lg">
            <Link href="/register">
              Create your account <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t bg-secondary py-8 text-secondary-foreground">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-secondary-foreground/70 sm:flex-row">
          <div className="flex items-center gap-2 font-semibold text-secondary-foreground">
            <Dumbbell className="h-4 w-4 text-primary" />
            FitForge AI
          </div>
          <p>&copy; {new Date().getFullYear()} FitForge AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
