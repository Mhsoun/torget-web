"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
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

export default function AdminInquiriesPage() {
  const { data: session } = useSession();
  const token = session?.accessToken ?? "";
  const qc = useQueryClient();

  const { data: inquiries = [], isLoading, isError: isInquiriesError } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: () => getInquiries(token),
    enabled: !!token,
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            ) : isInquiriesError ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-destructive">
                  Failed to load inquiries. Please refresh the page.
                </TableCell>
              </TableRow>
            ) : inquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No inquiries yet.
                </TableCell>
              </TableRow>
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
