"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        const data = res.data?.user || res.data;
        setForm({
          ...data,
          specialization: Array.isArray(data.specialization)
            ? data.specialization.join(", ")
            : data.specialization || "",
        });
      } catch (err) {
        toast({
          title: "Failed to load profile",
          description: err.response?.data?.message || "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
      };

      if (user?.role === "user") {
        Object.assign(payload, {
          gender: form.gender,
          age: form.age ? Number(form.age) : undefined,
          height: form.height ? Number(form.height) : undefined,
          weight: form.weight ? Number(form.weight) : undefined,
          targetWeight: form.targetWeight ? Number(form.targetWeight) : undefined,
          goal: form.goal,
          activityLevel: form.activityLevel,
          dietPreference: form.dietPreference,
        });
      } else if (user?.role === "trainer") {
        Object.assign(payload, {
          experience: form.experience ? Number(form.experience) : undefined,
          specialization:
            typeof form.specialization === "string"
              ? form.specialization.split(",").map((s) => s.trim()).filter(Boolean)
              : form.specialization,
          bio: form.bio,
          ratePerMonth: form.ratePerMonth ? Number(form.ratePerMonth) : undefined,
        });
      }

      const res = await api.put("/users/profile", payload);
      const updated = res.data?.user || res.data;
      updateUser(updated);
      toast({ title: "Profile updated", variant: "success" });
    } catch (err) {
      toast({
        title: "Update failed",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>View and update your account details</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name || ""}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={form.email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone || ""}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={form.role || ""} disabled className="capitalize" />
            </div>
          </div>

          {user?.role === "user" && (
            <div className="space-y-4 rounded-xl border p-4">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Health Profile
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={form.gender || ""} onValueChange={(v) => update("gender", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={form.age ?? ""}
                    onChange={(e) => update("age", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={form.height ?? ""}
                    onChange={(e) => update("height", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={form.weight ?? ""}
                    onChange={(e) => update("weight", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                  <Input
                    id="targetWeight"
                    type="number"
                    value={form.targetWeight ?? ""}
                    onChange={(e) => update("targetWeight", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Goal</Label>
                  <Select value={form.goal || ""} onValueChange={(v) => update("goal", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight_loss">Weight Loss</SelectItem>
                      <SelectItem value="weight_gain">Weight Gain</SelectItem>
                      <SelectItem value="maintain">Maintain</SelectItem>
                      <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Activity Level</Label>
                  <Select
                    value={form.activityLevel || ""}
                    onValueChange={(v) => update("activityLevel", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="very_active">Very Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Diet Preference</Label>
                  <Select
                    value={form.dietPreference || ""}
                    onValueChange={(v) => update("dietPreference", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select diet preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veg">Vegetarian</SelectItem>
                      <SelectItem value="nonveg">Non-Vegetarian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {user?.role === "trainer" && (
            <div className="space-y-4 rounded-xl border p-4">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Trainer Profile
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={form.experience ?? ""}
                    onChange={(e) => update("experience", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ratePerMonth">Rate per Month (₹)</Label>
                  <Input
                    id="ratePerMonth"
                    type="number"
                    value={form.ratePerMonth ?? ""}
                    onChange={(e) => update("ratePerMonth", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="specialization">
                    Specialization (comma-separated)
                  </Label>
                  <Input
                    id="specialization"
                    value={form.specialization || ""}
                    onChange={(e) => update("specialization", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={3}
                    value={form.bio || ""}
                    onChange={(e) => update("bio", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
