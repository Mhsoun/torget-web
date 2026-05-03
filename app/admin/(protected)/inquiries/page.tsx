"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInquiries, patchInquiryStatus } from "@/lib/api";
import { formatDate } from "@/lib/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { INQUIRY_STATUSES } from "@/types/torget";
import { useAdminAccessToken } from "@/hooks/useAdminAccessToken";
import { AdminErrorPanel, AdminTableStateRow } from "@/components/admin/state";

export default function AdminInquiriesPage() {
  const { token, isSessionLoading, isAuthenticated, callbackUrl } = useAdminAccessToken();
  const qc = useQueryClient();

  const { data: inquiries = [], isLoading, isError: isInquiriesError, error, refetch } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: () => getInquiries(token),
    enabled: isAuthenticated,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      patchInquiryStatus(id, { status }, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-inquiries"] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Inquiries</h1>
      </div>
      {statusMutation.isError ? (
        <AdminErrorPanel
          error={statusMutation.error}
          onSignIn={() => window.location.assign(`/admin/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)}
        />
      ) : null}
      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isSessionLoading || isLoading ? (
              <AdminTableStateRow colSpan={8} variant="loading" text="Loading inquiries…" />
            ) : isInquiriesError ? (
              <AdminTableStateRow
                colSpan={8}
                variant="error"
                text={error instanceof Error ? error.message : "Failed to load inquiries."}
                retry={() => refetch()}
              />
            ) : inquiries.length === 0 ? (
              <AdminTableStateRow colSpan={8} variant="empty" text="No inquiries yet." />
            ) : (
              inquiries.map((inq) => (
                <TableRow key={inq.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    <Link
                      href={`/admin/inquiries/${inq.id}`}
                      className="hover:underline text-foreground"
                    >
                      {inq.name}
                    </Link>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{inq.email}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {inq.phone ?? "—"}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm">
                    {inq.message}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/items/${inq.itemId}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View item
                    </Link>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(inq.createdAtUtc)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{inq.status || "New"}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {INQUIRY_STATUSES.filter((s) => s !== inq.status).map((s) => (
                        <Button
                          key={s}
                          size="sm"
                          variant="outline"
                          onClick={() => statusMutation.mutate({ id: inq.id, status: s })}
                          disabled={statusMutation.isPending}
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
