"use client";

import { useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getItem, getCategories, updateAdminItemAttributes, updateItem } from "@/lib/api";
import type { AdminItemFormSubmitData } from "@/components/admin/AdminItemForm";
import { AdminItemForm } from "@/components/admin/AdminItemForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AdminItemImagesPanel } from "@/components/admin/AdminItemImagesPanel";

export default function EditItemPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.accessToken ?? "";
  const [saved, setSaved] = useState(false);

  const { data: item, isLoading } = useQuery({
    queryKey: ["item", id],
    queryFn: () => getItem(id),
    enabled: !!id && !!token,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const mutation = useMutation({
    mutationFn: async ({ item: itemBody, attributes }: AdminItemFormSubmitData) => {
      await updateItem(id, itemBody, token);
      await updateAdminItemAttributes(id, attributes, token);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["item", id] });
      await queryClient.invalidateQueries({ queryKey: ["items"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  if (isLoading) {
    return <div className="p-4 text-muted-foreground">Loading…</div>;
  }

  if (!item) {
    return <div className="p-4 text-destructive">Item not found.</div>;
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Link href="/admin/items" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to items
      </Link>
      {searchParams.get("created") === "1" && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
          Item created. You can now review attributes again and add images below.
        </div>
      )}
      {saved && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          Changes saved successfully.
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Edit item</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminItemForm
            item={item}
            itemId={id}
            categories={categories}
            token={token}
            submitLabel="Save changes"
            submittingLabel="Saving…"
            onSubmit={(values) => mutation.mutateAsync(values)}
            onCancel={() => router.push("/admin/items")}
          />
        </CardContent>
      </Card>

      <AdminItemImagesPanel itemId={id} itemName={item.name} token={token} />
    </div>
  );
}