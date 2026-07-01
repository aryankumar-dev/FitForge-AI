"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";

function statusVariant(status) {
  if (status === "accepted") return "success";
  if (status === "rejected") return "destructive";
  return "warning";
}

function AdminRequestsContent() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get("/admin/hire-requests");
        setRequests(Array.isArray(res.data) ? res.data : res.data?.requests || []);
      } catch (err) {
        toast({
          title: "Failed to load hire requests",
          description: err.response?.data?.message || "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hire Requests</h1>
        <p className="text-muted-foreground">All hire requests across the platform.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {requests.length} request{requests.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : requests.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req._id}>
                    <TableCell className="font-medium">
                      {req.user?.name || "—"}
                    </TableCell>
                    <TableCell>{req.trainer?.name || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(req.status)} className="capitalize">
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {req.createdAt
                        ? new Date(req.createdAt).toLocaleDateString()
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No hire requests found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminRequestsPage() {
  return (
    <RequireAuth allowedRoles={["admin"]}>
      <AdminRequestsContent />
    </RequireAuth>
  );
}
