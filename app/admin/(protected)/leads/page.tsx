"use client";

import { useQuery } from "@tanstack/react-query";
import { getLeads } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { AdminCapabilityBadge } from "@/components/admin/capabilities";
import { getAdminCapability } from "@/lib/admin/capabilities";
import { useAdminAccessToken } from "@/hooks/useAdminAccessToken";
import { AdminTableStateRow } from "@/components/admin/state";

export default function AdminLeadsPage() {
  const { token, isSessionLoading, isAuthenticated } = useAdminAccessToken();
  const leadsCapability = getAdminCapability("leads");

  const { data: leads = [], isLoading, isError: isLeadsError, error, refetch } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: () => getLeads(token),
    enabled: isAuthenticated,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Leads</h1>
        <AdminCapabilityBadge domain="leads" />
      </div>
      <div className="rounded-md border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
        {leadsCapability.description}
      </div>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isSessionLoading || isLoading ? (
              <AdminTableStateRow colSpan={3} variant="loading" text="Loading leads…" />
            ) : isLeadsError ? (
              <AdminTableStateRow
                colSpan={3}
                variant="error"
                text={error instanceof Error ? error.message : "Failed to load leads."}
                retry={() => refetch()}
              />
            ) : leads.length === 0 ? (
              <AdminTableStateRow colSpan={3} variant="empty" text="No leads yet." />
            ) : (
              leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{lead.status || "—"}</Badge>
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
