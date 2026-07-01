"use client";

import { useState } from "react";
import { Star, BadgeCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";

export default function TrainerCard({ trainer }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const specializations = Array.isArray(trainer.specialization)
    ? trainer.specialization
    : typeof trainer.specialization === "string" && trainer.specialization
    ? trainer.specialization.split(",").map((s) => s.trim())
    : [];

  const handleHire = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="flex items-center gap-1.5">
            {trainer.name}
            <BadgeCheck className="h-4 w-4 text-primary" />
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {trainer.experience ?? 0} yrs experience
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-semibold">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          {trainer.rating ?? "N/A"}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {specializations.map((s, i) => (
            <Badge key={i} variant="secondary">
              {s}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {trainer.bio || "No bio provided."}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-semibold text-primary">
            ₹{trainer.ratePerMonth ?? "N/A"}
            <span className="text-xs text-muted-foreground font-normal">/mo</span>
          </span>
          <Button size="sm" onClick={() => setOpen(true)}>
            Hire
          </Button>
        </div>
      </CardContent>

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
            <Button onClick={handleHire} disabled={loading || !message.trim()}>
              {loading ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
