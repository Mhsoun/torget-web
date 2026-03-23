"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getItem, getCategories, updateItem } from "@/lib/api";
import { ItemStatus } from "@/types/torget";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().positive("Price must be positive"),
  categoryId: z.string().optional(),
  status: z.nativeEnum(ItemStatus),
});

type FormValues = z.infer<typeof schema>;

export default function EditItemPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken ?? "";

  const { data: item, isLoading } = useQuery({
    queryKey: ["item", id],
    queryFn: () => getItem(id),
    enabled: !!id && !!token,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
    defaultValues: { name: "", price: 0, status: ItemStatus.Draft },
  });

  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        price: item.price,
        categoryId: item.categoryId ?? undefined,
        status: item.status as ItemStatus,
      });
    }
  }, [item, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) => updateItem(id, values, token),
    onSuccess: () => router.push("/admin/items"),
  });

  const statusValue = watch("status") as ItemStatus;
  const categoryIdValue = watch("categoryId") as string | undefined;

  if (isLoading) {
    return <div className="p-4 text-muted-foreground">Loading…</div>;
  }

  if (!item) {
    return <div className="p-4 text-destructive">Item not found.</div>;
  }

  return (
    <div className="max-w-lg space-y-4">
      <Link href="/admin/items" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to items
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Edit item</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((v) => mutation.mutateAsync(v as FormValues))}
            className="space-y-4"
          >
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="price">Price (NOK)</Label>
              <Input id="price" type="number" step="0.01" {...register("price")} />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
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
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
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
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(ItemStatus.Draft)}>Draft</SelectItem>
                  <SelectItem value={String(ItemStatus.Active)}>Active</SelectItem>
                  <SelectItem value={String(ItemStatus.Sold)}>Sold</SelectItem>
                  <SelectItem value={String(ItemStatus.Archived)}>Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Save changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/items")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
