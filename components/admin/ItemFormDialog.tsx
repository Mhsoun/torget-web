"use client";

import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryResponse, ItemDetailResponse, ItemStatus } from "@/types/torget";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().positive("Price must be positive"),
  categoryId: z.string().optional(),
  status: z.nativeEnum(ItemStatus),
});

export type ItemFormValues = z.infer<typeof schema>;

interface ItemFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ItemFormValues) => Promise<void>;
  categories: CategoryResponse[];
  initialValues?: ItemDetailResponse;
  title: string;
}

export function ItemFormDialog({
  open,
  onClose,
  onSubmit,
  categories,
  initialValues,
  title,
}: ItemFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<ItemFormValues>,
    defaultValues: {
      name: "",
      price: 0,
      categoryId: undefined,
      status: ItemStatus.Draft,
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name,
        price: initialValues.price,
        categoryId: initialValues.categoryId ?? undefined,
        status: initialValues.status,
      });
    } else {
      reset({ name: "", price: 0, categoryId: undefined, status: ItemStatus.Draft });
    }
  }, [initialValues, reset, open]);

  const statusValue = watch("status");
  const categoryIdValue = watch("categoryId") as string | undefined;

  async function handleFormSubmit(values: ItemFormValues) {
    await onSubmit(values);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit as Parameters<typeof handleSubmit>[0])} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="price">Price (NOK)</Label>
            <Input id="price" type="number" step="0.01" {...register("price")} />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label>Category</Label>
            <Select
              value={categoryIdValue ?? "none"}
              onValueChange={(v) => setValue("categoryId", v === "none" || v == null ? undefined : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No category</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select
              value={String(statusValue)}
              onValueChange={(v) => setValue("status", Number(v) as ItemStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={String(ItemStatus.Draft)}>Draft</SelectItem>
                <SelectItem value={String(ItemStatus.Active)}>Active</SelectItem>
                <SelectItem value={String(ItemStatus.Sold)}>Sold</SelectItem>
                <SelectItem value={String(ItemStatus.Archived)}>Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
