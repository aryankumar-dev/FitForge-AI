"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Save, Upload, X } from "lucide-react";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api, { mediaUrl } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const photoInputRef = useRef(null);
  const galleryInputRef = useRef(null);

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

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const data = new FormData();
      data.append("photo", file);
      const res = await api.post("/users/profile/photo", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updated = res.data?.user || res.data;
      setForm((f) => ({ ...f, profilePicture: updated.profilePicture }));
      updateUser(updated);
      toast({ title: "Profile picture updated", variant: "success" });
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleGalleryChange = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    const existingCount = form.gallery?.length || 0;
    if (existingCount + files.length > 5) {
      toast({
        title: "Too many photos",
        description: `You can have at most 5 gallery photos (you have ${existingCount}).`,
        variant: "destructive",
      });
      return;
    }

    setUploadingGallery(true);
    try {
      const data = new FormData();
      files.forEach((file) => data.append("photos", file));
      const res = await api.post("/users/profile/gallery", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updated = res.data?.user || res.data;
      setForm((f) => ({ ...f, gallery: updated.gallery }));
      updateUser(updated);
      toast({ title: "Gallery updated", variant: "success" });
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleDeleteGalleryPhoto = async (photoUrl) => {
    try {
      const res = await api.delete("/users/profile/gallery", { data: { photoUrl } });
      const updated = res.data?.user || res.data;
      setForm((f) => ({ ...f, gallery: updated.gallery }));
      updateUser(updated);
    } catch (err) {
      toast({
        title: "Could not remove photo",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

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
          <div className="flex items-center gap-4 rounded-xl border p-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={mediaUrl(form.profilePicture)} alt={form.name} />
              <AvatarFallback className="text-lg">
                {form.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium">Profile Picture</p>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploadingPhoto}
                onClick={() => photoInputRef.current?.click()}
              >
                {uploadingPhoto ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                {uploadingPhoto ? "Uploading..." : "Change Photo"}
              </Button>
            </div>
          </div>

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

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Gallery ({form.gallery?.length || 0}/5)</Label>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadingGallery || (form.gallery?.length || 0) >= 5}
                    onClick={() => galleryInputRef.current?.click()}
                  >
                    {uploadingGallery ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    {uploadingGallery ? "Uploading..." : "Add Photos"}
                  </Button>
                </div>
                {form.gallery?.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {form.gallery.map((photo, i) => (
                      <div key={i} className="relative aspect-square overflow-hidden rounded-lg border">
                        <img
                          src={mediaUrl(photo)}
                          alt={`Gallery ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteGalleryPhoto(photo)}
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
