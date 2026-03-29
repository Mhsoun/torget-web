"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminItemForm, type AdminItemFormSubmitData } from "@/components/admin/AdminItemForm";
import { CategoryResponse } from "@/types/torget";

interface ItemFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AdminItemFormSubmitData) => Promise<void>;
  categories: CategoryResponse[];
  token: string;
}

export function ItemFormDialog({
  open,
  onClose,
  onSubmit,
  categories,
  token,
}: ItemFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>New item</DialogTitle>
          <DialogDescription>
            Create the item first, then continue on the edit page to manage images.
          </DialogDescription>
        </DialogHeader>
        <AdminItemForm
          categories={categories}
          token={token}
          submitLabel="Create item"
          submittingLabel="Creating…"
          onSubmit={async (values) => {
            await onSubmit(values);
            onClose();
          }}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
