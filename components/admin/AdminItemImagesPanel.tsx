"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addItemImage,
  deleteItemImage,
  listItemImages,
  setItemImagePrimary,
  updateItemImage,
  uploadItemImage,
  type ItemImageWriteRequest,
} from "@/lib/api";
import type { ItemImageResponse } from "@/types/torget";
import { AdminItemImageRow } from "@/components/admin/AdminItemImageRow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, UploadIcon } from "lucide-react";

const imagesQueryKey = (itemId: string) => ["admin", "item-images", itemId] as const;

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,image/gif";
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

function sortImages(images: ItemImageResponse[]): ItemImageResponse[] {
  return [...images].sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id));
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface AdminItemImagesPanelProps {
  itemId: string;
  itemName: string;
  token: string;
}

export function AdminItemImagesPanel({ itemId, itemName, token }: AdminItemImagesPanelProps) {
  const queryClient = useQueryClient();
  const [panelError, setPanelError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ItemImageResponse | null>(null);
  const [deleting, setDeleting] = useState<ItemImageResponse | null>(null);

  // Upload form state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadSort, setUploadSort] = useState("");
  const [uploadPrimary, setUploadPrimary] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // URL add form state
  const [addUrl, setAddUrl] = useState("");
  const [addAlt, setAddAlt] = useState("");
  const [addSort, setAddSort] = useState("");
  const [addPrimary, setAddPrimary] = useState(false);

  // Edit dialog state
  const [editUrl, setEditUrl] = useState("");
  const [editAlt, setEditAlt] = useState("");
  const [editSort, setEditSort] = useState("");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: imagesQueryKey(itemId),
    queryFn: () => listItemImages(itemId, token),
    enabled: !!itemId && !!token,
  });

  const sorted = useMemo(() => (data ? sortImages(data) : []), [data]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: imagesQueryKey(itemId) });
    queryClient.invalidateQueries({ queryKey: ["item", itemId] });
  };

  const uploadMutation = useMutation({
    mutationFn: ({ file, meta }: { file: File; meta: { altText?: string; sortOrder: number; isPrimary: boolean } }) =>
      uploadItemImage(itemId, file, meta, token),
    onSuccess: async (created, variables) => {
      setUploadError(null);
      setPanelError(null);
      setUploadFile(null);
      setUploadAlt("");
      setUploadSort("");
      setUploadPrimary(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      invalidate();
      if (variables.meta.isPrimary) {
        try {
          await setItemImagePrimary(itemId, created.id, token);
        } catch {
          // Best-effort
        }
        invalidate();
      }
    },
    onError: (e: Error) => setUploadError(e.message),
  });

  const addMutation = useMutation({
    mutationFn: (body: ItemImageWriteRequest) => addItemImage(itemId, body, token),
    onSuccess: async (created, variables) => {
      setPanelError(null);
      setAddUrl("");
      setAddAlt("");
      setAddSort("");
      setAddPrimary(false);
      invalidate();
      if (variables.isPrimary) {
        try {
          await setItemImagePrimary(itemId, created.id, token);
        } catch {
          // POST may have set primary; dedicated endpoint ensures single primary
        }
        invalidate();
      }
    },
    onError: (e: Error) => setPanelError(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ imageId, body }: { imageId: string; body: ItemImageWriteRequest }) =>
      updateItemImage(itemId, imageId, body, token),
    onSuccess: () => {
      setPanelError(null);
      setEditing(null);
      invalidate();
    },
    onError: (e: Error) => setPanelError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (imageId: string) => deleteItemImage(itemId, imageId, token),
    onSuccess: () => {
      setPanelError(null);
      setDeleting(null);
      invalidate();
    },
    onError: (e: Error) => setPanelError(e.message),
  });

  const primaryMutation = useMutation({
    mutationFn: (imageId: string) => setItemImagePrimary(itemId, imageId, token),
    onSuccess: () => {
      setPanelError(null);
      invalidate();
    },
    onError: (e: Error) => setPanelError(e.message),
  });

  const busy =
    uploadMutation.isPending ||
    addMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    primaryMutation.isPending;

  const nextSortDefault = useMemo(() => {
    if (!sorted.length) return 0;
    return Math.max(...sorted.map((i) => i.sortOrder)) + 1;
  }, [sorted]);

  function openEdit(img: ItemImageResponse) {
    setEditing(img);
    setEditUrl(img.url);
    setEditAlt(img.altText ?? "");
    setEditSort(String(img.sortOrder));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUploadError(null);
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setUploadFile(null);
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setUploadError(`File is too large (${formatBytes(file.size)}). Maximum is 10 MB.`);
      setUploadFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setUploadFile(file);
  }

  function submitUpload(e: FormEvent) {
    e.preventDefault();
    setUploadError(null);
    if (!uploadFile) {
      setUploadError("Please select a file.");
      return;
    }
    const sortOrder = uploadSort.trim() === "" ? nextSortDefault : Number(uploadSort);
    if (!Number.isFinite(sortOrder)) {
      setUploadError("Sort order must be a number.");
      return;
    }
    uploadMutation.mutate({
      file: uploadFile,
      meta: {
        altText: uploadAlt.trim() || undefined,
        sortOrder,
        isPrimary: uploadPrimary,
      },
    });
  }

  function submitAdd(e: FormEvent) {
    e.preventDefault();
    setPanelError(null);
    const url = addUrl.trim();
    if (!url) {
      setPanelError("Image URL is required.");
      return;
    }
    const sortOrder = addSort.trim() === "" ? nextSortDefault : Number(addSort);
    if (!Number.isFinite(sortOrder)) {
      setPanelError("Sort order must be a number.");
      return;
    }
    addMutation.mutate({
      url,
      altText: addAlt.trim() || undefined,
      sortOrder,
      isPrimary: addPrimary,
    });
  }

  function submitEdit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setPanelError(null);
    const url = editUrl.trim();
    if (!url) {
      setPanelError("Image URL is required.");
      return;
    }
    const sortOrder = Number(editSort);
    if (!Number.isFinite(sortOrder)) {
      setPanelError("Sort order must be a number.");
      return;
    }
    updateMutation.mutate({
      imageId: editing.id,
      body: {
        url,
        altText: editAlt.trim() || undefined,
        sortOrder,
        isPrimary: editing.isPrimary,
      },
    });
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-base">Images</CardTitle>
        <CardDescription>
          Upload image files or add by URL. One image can be marked as primary.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {panelError && (
          <div
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {panelError}
          </div>
        )}

        {isLoading && (
          <div className="space-y-3" aria-busy="true">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4 rounded-lg border border-border p-3">
                <div className="h-24 w-28 shrink-0 animate-pulse rounded-md bg-muted" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-full max-w-md animate-pulse rounded bg-muted" />
                  <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && !isLoading && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-4 text-sm text-destructive">
            <p className="font-medium">Could not load images</p>
            <p className="mt-1 text-destructive/90">{error instanceof Error ? error.message : "Unknown error"}</p>
            <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !isError && sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 py-10 text-center">
            <ImageIcon className="size-10 text-muted-foreground/50" aria-hidden />
            <p className="text-sm font-medium text-foreground">No images yet</p>
            <p className="max-w-sm text-xs text-muted-foreground">
              Upload an image file or paste a hosted image URL below.
            </p>
          </div>
        )}

        {!isLoading && !isError && sorted.length > 0 && (
          <div className="space-y-3">
            {sorted.map((img) => (
              <AdminItemImageRow
                key={img.id}
                image={img}
                altFallback={itemName}
                disabled={busy}
                onEdit={() => openEdit(img)}
                onDelete={() => setDeleting(img)}
                onSetPrimary={() => primaryMutation.mutate(img.id)}
              />
            ))}
          </div>
        )}

        {/* Upload file section */}
        <div className="border-t border-border pt-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
            <UploadIcon className="size-4 text-muted-foreground" aria-hidden />
            Upload image file
          </h3>

          {uploadError && (
            <div
              className="mb-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              {uploadError}
            </div>
          )}

          <form onSubmit={submitUpload} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="upload-file">Image file</Label>
              <Input
                id="upload-file"
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES}
                onChange={handleFileChange}
                disabled={busy}
                className="cursor-pointer file:cursor-pointer file:text-sm"
              />
              {uploadFile && (
                <p className="text-xs text-muted-foreground">
                  {uploadFile.name} — {formatBytes(uploadFile.size)}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                JPEG, PNG, WebP, or GIF. Max 10 MB.
              </p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="upload-alt">Alt text (optional)</Label>
              <Textarea
                id="upload-alt"
                value={uploadAlt}
                onChange={(e) => setUploadAlt(e.target.value)}
                rows={2}
                disabled={busy}
                className="min-h-0 resize-y"
              />
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-1">
                <Label htmlFor="upload-sort">Sort order</Label>
                <Input
                  id="upload-sort"
                  type="number"
                  value={uploadSort}
                  onChange={(e) => setUploadSort(e.target.value)}
                  placeholder={String(nextSortDefault)}
                  disabled={busy}
                  className="w-28"
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2 pb-2 text-sm">
                <input
                  type="checkbox"
                  checked={uploadPrimary}
                  onChange={(e) => setUploadPrimary(e.target.checked)}
                  disabled={busy}
                  className="size-4 rounded border-input accent-primary"
                />
                Set as primary
              </label>
            </div>
            <Button type="submit" disabled={busy || !uploadFile}>
              {uploadMutation.isPending ? "Uploading…" : "Upload image"}
            </Button>
          </form>
        </div>

        {/* Add by URL section */}
        <div className="border-t border-border pt-6">
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">Or add by URL</h3>
          <form onSubmit={submitAdd} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="new-image-url">Image URL</Label>
              <Input
                id="new-image-url"
                value={addUrl}
                onChange={(e) => setAddUrl(e.target.value)}
                placeholder="https://…"
                disabled={busy}
                autoComplete="off"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new-image-alt">Alt text (optional)</Label>
              <Textarea
                id="new-image-alt"
                value={addAlt}
                onChange={(e) => setAddAlt(e.target.value)}
                rows={2}
                disabled={busy}
                className="min-h-0 resize-y"
              />
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-1">
                <Label htmlFor="new-image-sort">Sort order</Label>
                <Input
                  id="new-image-sort"
                  type="number"
                  value={addSort}
                  onChange={(e) => setAddSort(e.target.value)}
                  placeholder={String(nextSortDefault)}
                  disabled={busy}
                  className="w-28"
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2 pb-2 text-sm">
                <input
                  type="checkbox"
                  checked={addPrimary}
                  onChange={(e) => setAddPrimary(e.target.checked)}
                  disabled={busy}
                  className="size-4 rounded border-input accent-primary"
                />
                Set as primary
              </label>
            </div>
            <Button type="submit" variant="outline" disabled={busy || addMutation.isPending}>
              {addMutation.isPending ? "Adding…" : "Add by URL"}
            </Button>
          </form>
        </div>
      </CardContent>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="sm:max-w-md" showCloseButton={!updateMutation.isPending}>
          <DialogHeader>
            <DialogTitle>Edit image</DialogTitle>
            <DialogDescription>Use Set primary on the list to change which image is primary.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submitEdit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="edit-url">Image URL</Label>
              <Input
                id="edit-url"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                disabled={updateMutation.isPending}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-alt">Alt text</Label>
              <Textarea
                id="edit-alt"
                value={editAlt}
                onChange={(e) => setEditAlt(e.target.value)}
                rows={2}
                disabled={updateMutation.isPending}
                className="min-h-0 resize-y"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-sort">Sort order</Label>
              <Input
                id="edit-sort"
                type="number"
                value={editSort}
                onChange={(e) => setEditSort(e.target.value)}
                disabled={updateMutation.isPending}
                className="w-32"
              />
            </div>
            <DialogFooter className="border-0 bg-transparent p-0 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(null)}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving…" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent className="sm:max-w-sm" showCloseButton={!deleteMutation.isPending}>
          <DialogHeader>
            <DialogTitle>Delete image?</DialogTitle>
            <DialogDescription>
              This removes the image record. Uploaded files will also be deleted from storage.
            </DialogDescription>
          </DialogHeader>
          {deleting && (
            <p
              className="truncate rounded-md bg-muted/50 px-2 py-1 font-mono text-xs text-muted-foreground"
              title={deleting.url}
            >
              {deleting.url}
            </p>
          )}
          <DialogFooter className="border-0 bg-transparent p-0 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleting(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleting && deleteMutation.mutate(deleting.id)}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
