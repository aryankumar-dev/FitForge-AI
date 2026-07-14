"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Star, BadgeCheck } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import api, { mediaUrl } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

function TrainerDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [hiring, setHiring] = useState(false);
  const [activePhoto, setActivePhoto] = useState(null);

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const res = await api.get(`/trainers/${id}`);
        setTrainer(res.data?.trainer || res.data);
      } catch (err) {
        toast({
          title: "Failed to load trainer",
          description: err.response?.data?.message || "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTrainer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleHire = async () => {
    setHiring(true);
    try {
      await api.post("/hire-requests", {
        trainerId: trainer._id,
        message,
      });
      toast({
        title: "Request sent",
        description: `Your hire request to ${trainer.name} was sent.`,
        variant: "success",
      });
      setOpen(false);
      setMessage("");
    } catch (err) {
      toast({
        title: "Could not send request",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setHiring(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!trainer) {
    return <p className="text-sm text-muted-foreground">Trainer not found.</p>;
  }

  const specializations = Array.isArray(trainer.specialization)
    ? trainer.specialization
    : typeof trainer.specialization === "string" && trainer.specialization
    ? trainer.specialization.split(",").map((s) => s.trim())
    : [];

  const gallery = Array.isArray(trainer.gallery) ? trainer.gallery : [];

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={mediaUrl(trainer.profilePicture)} alt={trainer.name} />
              <AvatarFallback className="text-xl">
                {trainer.name?.[0]?.toUpperCase() || "T"}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-1.5 text-xl">
                {trainer.name}
                <BadgeCheck className="h-5 w-5 text-primary" />
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {trainer.experience ?? 0} yrs experience
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {specializations.map((s, i) => (
                  <Badge key={i} variant="secondary">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-sm font-semibold">
            <Star className="h-4 w-4 fill-accent text-accent" />
            {trainer.rating ?? "N/A"}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            {trainer.bio || "No bio provided."}
          </p>

          {gallery.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Gallery</h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                {gallery.map((photo, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActivePhoto(mediaUrl(photo))}
                    className="aspect-square overflow-hidden rounded-lg border"
                  >
                    <img
                      src={mediaUrl(photo)}
                      alt={`${trainer.name} photo ${i + 1}`}
                      className="h-full w-full object-cover transition hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl border p-4">
            <span className="font-semibold text-primary text-lg">
              ₹{trainer.ratePerMonth ?? "N/A"}
              <span className="text-xs text-muted-foreground font-normal">/mo</span>
            </span>
            <Button onClick={() => setOpen(true)}>Hire</Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hire {trainer.name}</DialogTitle>
            <DialogDescription>
              Send a short message with your goals so the trainer knows how to help.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="hire-message">Message</Label>
            <Textarea
              id="hire-message"
              placeholder="Hi, I'd like your help with..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleHire} disabled={hiring || !message.trim()}>
              {hiring ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!activePhoto} onOpenChange={(o) => !o && setActivePhoto(null)}>
        <DialogContent className="max-w-2xl">
          {activePhoto && (
            <img
              src={activePhoto}
              alt={`${trainer.name} full size`}
              className="max-h-[75vh] w-full rounded-lg object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function TrainerDetailPage() {
  return (
    <RequireAuth allowedRoles={["user"]}>
      <TrainerDetailContent />
    </RequireAuth>
  );
}
