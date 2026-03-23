"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  getItems,
  getCategories,
  createItem,
  updateItem,
  deleteItem,
  patchItemStatus,
} from "@/lib/api";
import { ItemDetailResponse, ItemStatus, ITEM_STATUS_LABELS } from "@/types/torget";
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
import { ItemFormDialog, ItemFormValues } from "@/components/admin/ItemFormDialog";
import { MoreHorizontal, Plus } from "lucide-react";

export default function AdminItemsPage() {
  const { data: session } = useSession();
  const token = session?.accessToken ?? "";
  const qc = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ItemDetailResponse | undefined>();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: () => getItems(),
    enabled: !!token,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  const createMutation = useMutation({
    mutationFn: (values: ItemFormValues) => createItem(values, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["items"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: ItemFormValues }) =>
      updateItem(id, values, token),
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

  async function handleFormSubmit(values: ItemFormValues) {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, values });
    } else {
      await createMutation.mutateAsync(values);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Items</h1>
        <Button
          onClick={() => {
            setEditing(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          New item
        </Button>
      </div>

      <div className="rounded-md border bg-white">
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No items yet.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const detail = item as unknown as ItemDetailResponse;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {detail.categoryId ? (categoryMap[detail.categoryId] ?? "—") : "—"}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("nb-NO", {
                        style: "currency",
                        currency: "NOK",
                      }).format(item.price)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={detail.status === ItemStatus.Active ? "default" : "secondary"}>
                        {detail.status !== undefined
                          ? ITEM_STATUS_LABELS[detail.status]
                          : "—"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditing(detail);
                              setDialogOpen(true);
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {detail.status !== ItemStatus.Active && (
                            <DropdownMenuItem
                              onClick={() =>
                                statusMutation.mutate({ id: item.id, status: ItemStatus.Active })
                              }
                            >
                              Set Active
                            </DropdownMenuItem>
                          )}
                          {detail.status !== ItemStatus.Archived && (
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
        onSubmit={handleFormSubmit}
        categories={categories}
        initialValues={editing}
        title={editing ? "Edit item" : "New item"}
      />
    </div>
  );
}
