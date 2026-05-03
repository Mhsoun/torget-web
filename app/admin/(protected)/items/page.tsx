"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getItems,
  getCategories,
  createItem,
  updateAdminItemAttributes,
  deleteItem,
  patchItemStatus,
} from "@/lib/api";
import { ItemStatus, ITEM_STATUS_LABELS } from "@/types/torget";
import { formatPrice } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ItemFormDialog } from "@/components/admin/ItemFormDialog";
import type { AdminItemFormSubmitData } from "@/components/admin/AdminItemForm";
import { MoreHorizontal, Plus } from "lucide-react";
import { useAdminAccessToken } from "@/hooks/useAdminAccessToken";
import { AdminErrorPanel, AdminTableStateRow } from "@/components/admin/state";

export default function AdminItemsPage() {
  const router = useRouter();
  const { token, isSessionLoading, isAuthenticated, callbackUrl } = useAdminAccessToken();
  const qc = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: items = [], isLoading, isError: isItemsError, error: itemsError, refetch: refetchItems } = useQuery({
    queryKey: ["items"],
    queryFn: () => getItems(),
    enabled: isAuthenticated,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    enabled: isAuthenticated,
  });
  const createMutation = useMutation({
    mutationFn: async ({ item, attributes }: AdminItemFormSubmitData) => {
      const created = await createItem(item, token);
      await updateAdminItemAttributes(created.id, attributes, token);
      return created;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["items"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteItem(id, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["items"] }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ItemStatus }) =>
      patchItemStatus(id, { status }, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["items"] }),
  });

  async function handleCreate(values: AdminItemFormSubmitData) {
    const created = await createMutation.mutateAsync(values);
    setDialogOpen(false);
    router.push(`/admin/items/${created.id}?created=1`);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Items</h1>
        <Button
          onClick={() => {
            setDialogOpen(true);
          }}
          disabled={!isAuthenticated || isSessionLoading}
        >
          <Plus className="h-4 w-4 mr-1" />
          New item
        </Button>
      </div>
      {createMutation.isError ? (
        <AdminErrorPanel
          error={createMutation.error}
          onSignIn={() => router.replace(`/admin/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)}
        />
      ) : null}
      {deleteMutation.isError ? (
        <AdminErrorPanel
          error={deleteMutation.error}
          onSignIn={() => router.replace(`/admin/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)}
        />
      ) : null}
      {statusMutation.isError ? (
        <AdminErrorPanel
          error={statusMutation.error}
          onSignIn={() => router.replace(`/admin/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)}
        />
      ) : null}

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isSessionLoading || isLoading ? (
              <AdminTableStateRow colSpan={5} variant="loading" text="Loading items…" />
            ) : isItemsError ? (
              <AdminTableStateRow
                colSpan={5}
                variant="error"
                text={itemsError instanceof Error ? itemsError.message : "Failed to load items."}
                retry={() => refetchItems()}
              />
            ) : items.length === 0 ? (
              <AdminTableStateRow colSpan={5} variant="empty" text="No items yet." />
            ) : (
              items.map((item) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.categoryName ?? "—"}</TableCell>
                    <TableCell>{formatPrice(item.price)}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === ItemStatus.Active ? "default" : "secondary"}>
                        {item.status !== undefined
                          ? ITEM_STATUS_LABELS[item.status]
                          : "—"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          disabled={deleteMutation.isPending || statusMutation.isPending}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent disabled:opacity-60"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/admin/items/${item.id}`)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {item.status !== ItemStatus.Active && (
                            <DropdownMenuItem
                              onClick={() =>
                                statusMutation.mutate({ id: item.id, status: ItemStatus.Active })
                              }
                            >
                              Set Active
                            </DropdownMenuItem>
                          )}
                          {item.status !== ItemStatus.Archived && (
                            <DropdownMenuItem
                              onClick={() =>
                                statusMutation.mutate({ id: item.id, status: ItemStatus.Archived })
                              }
                            >
                              Archive
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              if (confirm(`Delete "${item.name}"?`)) {
                                deleteMutation.mutate(item.id);
                              }
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <ItemFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreate}
        categories={categories}
        token={token}
      />
    </div>
  );
}
