"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  getAdminAttributes,
  createAdminAttribute,
  updateAdminAttribute,
  deleteAdminAttribute,
} from "@/lib/api";
import type {
  AdminAttributeDefinitionResponse,
  AdminAttributeDefinitionWriteRequest,
} from "@/types/torget";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminAttributeDefinitionForm } from "@/components/admin/AdminAttributeDefinitionForm";
import { MoreHorizontal, Plus, Tags } from "lucide-react";

export default function AdminAttributesPage() {
  const { data: session } = useSession();
  const token = session?.accessToken ?? "";
  const qc = useQueryClient();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminAttributeDefinitionResponse | null>(null);
  const [conflictError, setConflictError] = useState<string | null>(null);

  const { data: attributes = [], isLoading, isError } = useQuery({
    queryKey: ["admin-attributes"],
    queryFn: () => getAdminAttributes(token),
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: (body: AdminAttributeDefinitionWriteRequest) => createAdminAttribute(body, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-attributes"] });
      qc.invalidateQueries({ queryKey: ["definitions"] });
      setFormOpen(false);
      setConflictError(null);
    },
    onError: (err: Error) => {
      setConflictError(err.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: AdminAttributeDefinitionWriteRequest }) =>
      updateAdminAttribute(id, body, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-attributes"] });
      qc.invalidateQueries({ queryKey: ["definitions"] });
      setEditing(null);
      setConflictError(null);
    },
    onError: (err: Error) => {
      setConflictError(err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminAttribute(id, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-attributes"] });
      qc.invalidateQueries({ queryKey: ["definitions"] });
    },
    onError: (err: Error) => {
      alert(err.message);
    },
  });

  async function handleCreate(values: AdminAttributeDefinitionWriteRequest) {
    setConflictError(null);
    await createMutation.mutateAsync(values);
  }

  async function handleUpdate(values: AdminAttributeDefinitionWriteRequest) {
    if (!editing) return;
    setConflictError(null);
    await updateMutation.mutateAsync({ id: editing.id, body: values });
  }

  function openEdit(attr: AdminAttributeDefinitionResponse) {
    setEditing(attr);
    setConflictError(null);
  }

  function handleDelete(attr: AdminAttributeDefinitionResponse) {
    if (confirm(`Delete attribute "${attr.name}"?\n\nThis will fail if any items still have values for this attribute.`)) {
      deleteMutation.mutate(attr.id);
    }
  }

  const typeColors: Record<string, string> = {
    Text: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Number: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    Enum: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Bool: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tags className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Attributes</h1>
        </div>
        <Button onClick={() => { setFormOpen(true); setConflictError(null); }}>
          <Plus className="h-4 w-4 mr-1" />
          New attribute
        </Button>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Required</TableHead>
              <TableHead>Searchable</TableHead>
              <TableHead className="text-right">Sort</TableHead>
              <TableHead className="text-right">Options</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-destructive">
                  Failed to load attributes.
                </TableCell>
              </TableRow>
            ) : attributes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No attributes yet.
                </TableCell>
              </TableRow>
            ) : (
              attributes
                .slice()
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((attr) => (
                  <TableRow key={attr.id}>
                    <TableCell className="font-medium">{attr.name}</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{attr.slug}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeColors[attr.type] ?? ""}`}>
                        {attr.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      {attr.isRequired ? (
                        <Badge variant="default" className="text-xs">Yes</Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {attr.isSearchable ? (
                        <Badge variant="outline" className="text-xs">Yes</Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">No</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">{attr.sortOrder}</TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">
                      {attr.type === "Enum" ? attr.options.length : "—"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(attr)}>Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(attr)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create dialog */}
      <Dialog open={formOpen} onOpenChange={(open) => { setFormOpen(open); if (!open) setConflictError(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New attribute</DialogTitle>
            <DialogDescription>
              Define a new dynamic attribute that can be set on items.
            </DialogDescription>
          </DialogHeader>
          {conflictError && (
            <div className="rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm px-3 py-2">
              {conflictError}
            </div>
          )}
          <AdminAttributeDefinitionForm
            isSubmitting={createMutation.isPending}
            submitLabel="Create attribute"
            onSubmit={handleCreate}
            onCancel={() => { setFormOpen(false); setConflictError(null); }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(open) => { if (!open) { setEditing(null); setConflictError(null); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit attribute</DialogTitle>
            <DialogDescription>
              Update the definition. Removing enum options will fail if items still reference them.
            </DialogDescription>
          </DialogHeader>
          {conflictError && (
            <div className="rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm px-3 py-2">
              {conflictError}
            </div>
          )}
          {editing && (
            <AdminAttributeDefinitionForm
              definition={editing}
              isSubmitting={updateMutation.isPending}
              submitLabel="Save changes"
              onSubmit={handleUpdate}
              onCancel={() => { setEditing(null); setConflictError(null); }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
