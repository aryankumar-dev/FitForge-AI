"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, X } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

function statusVariant(status) {
  if (status === "accepted") return "success";
  if (status === "rejected") return "destructive";
  return "warning";
}

function RequestsContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/hire-requests/mine");
      setRequests(Array.isArray(res.data) ? res.data : res.data?.requests || []);
    } catch (err) {
      toast({
        title: "Failed to load requests",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatus = async (id, status) => {
    setActingId(id);
    try {
      await api.put(`/hire-requests/${id}/status`, { status });
      toast({ title: `Request ${status}`, variant: "success" });
      fetchRequests();
    } catch (err) {
      toast({
        title: "Action failed",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {user?.role === "trainer" ? "Hire Requests" : "My Requests"}
        </h1>
        <p className="text-muted-foreground">
          {user?.role === "trainer"
            ? "Review and respond to requests from users."
            : "Track the status of your hire requests."}
        </p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : requests.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => {
            const counterparty = user?.role === "trainer" ? req.user : req.trainer;
            return (
              <Card key={req._id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {counterparty?.name || "Unknown"}
                  </CardTitle>
                  <CardDescription>
                    {counterparty?.email}
                    {req.createdAt && (
                      <span className="block text-xs mt-1">
                        {new Date(req.createdAt).toLocaleString()}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{req.message}</p>
                  <Badge variant={statusVariant(req.status)} className="capitalize">
                    {req.status}
                  </Badge>

                  {user?.role === "trainer" && req.status === "pending" && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleStatus(req._id, "accepted")}
                        disabled={actingId === req._id}
                      >
                        <Check className="mr-1 h-4 w-4" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatus(req._id, "rejected")}
                        disabled={actingId === req._id}
                      >
                        <X className="mr-1 h-4 w-4" /> Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No requests found.</p>
      )}
    </div>
  );
}

export default function RequestsPage() {
  return (
    <RequireAuth allowedRoles={["user", "trainer"]}>
      <RequestsContent />
    </RequireAuth>
  );
}
