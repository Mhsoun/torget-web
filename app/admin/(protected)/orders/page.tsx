"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, patchOrderStatus } from "@/lib/api";
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
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/formatters";
import { AdminCapabilityBadge } from "@/components/admin/capabilities";
import { canMutateDomain, getAdminCapability } from "@/lib/admin/capabilities";
import { useAdminAccessToken } from "@/hooks/useAdminAccessToken";
import { AdminErrorPanel, AdminPendingHint, AdminTableStateRow } from "@/components/admin/state";

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Completed", "Cancelled"];

export default function AdminOrdersPage() {
  const { token, isSessionLoading, isAuthenticated, callbackUrl } = useAdminAccessToken();
  const qc = useQueryClient();
  const ordersCapability = getAdminCapability("orders");
  const canMutateOrders = canMutateDomain("orders");

  const { data: orders = [], isLoading, isError: isOrdersError, error, refetch } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => getOrders(token),
    enabled: isAuthenticated,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      patchOrderStatus(id, { status }, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Orders</h1>
        <AdminCapabilityBadge domain="orders" />
      </div>
      {!canMutateOrders ? (
        <div className="rounded-md border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
          {ordersCapability.description}
        </div>
      ) : null}
      {statusMutation.isError ? (
        <AdminErrorPanel
          error={statusMutation.error}
          onSignIn={() => window.location.assign(`/admin/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)}
        />
      ) : null}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Item ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isSessionLoading || isLoading ? (
              <AdminTableStateRow colSpan={5} variant="loading" text="Loading orders…" />
            ) : isOrdersError ? (
              <AdminTableStateRow
                colSpan={5}
                variant="error"
                text={error instanceof Error ? error.message : "Failed to load orders."}
                retry={() => refetch()}
              />
            ) : orders.length === 0 ? (
              <AdminTableStateRow colSpan={5} variant="empty" text="No orders yet." />
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}…</TableCell>
                  <TableCell className="font-mono text-xs">{order.itemId.slice(0, 8)}…</TableCell>
                  <TableCell>{formatPrice(order.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{order.status || "—"}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {ORDER_STATUSES.filter((s) => s !== order.status).map((s) => (
                        <Button
                          key={s}
                          size="sm"
                          variant="outline"
                          disabled={!canMutateOrders || statusMutation.isPending}
                          onClick={() => statusMutation.mutate({ id: order.id, status: s })}
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
      <AdminPendingHint show={statusMutation.isPending} text="Updating order status…" />
    </div>
  );
}
