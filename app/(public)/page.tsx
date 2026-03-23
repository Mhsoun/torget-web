"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getItems, getCategories } from "@/lib/api";
import { ItemGrid } from "@/components/items/ItemGrid";
import { ItemStatus } from "@/types/torget";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HomePage() {
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [status, setStatus] = useState<ItemStatus | undefined>(ItemStatus.Active);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["items", { categoryId, status }],
    queryFn: () => getItems({ categoryId, status }),
  });

  const enrichedItems = items.map((item) => ({ ...item }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Browse items</h1>
        <div className="flex gap-3">
          <Select
            value={categoryId ?? "all"}
            onValueChange={(v) => setCategoryId(v === "all" ? undefined : (v ?? undefined))}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={status !== undefined ? String(status) : "all"}
            onValueChange={(v) =>
              setStatus(v === "all" ? undefined : (Number(v) as ItemStatus))
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value={String(ItemStatus.Active)}>Active</SelectItem>
              <SelectItem value={String(ItemStatus.Draft)}>Draft</SelectItem>
              <SelectItem value={String(ItemStatus.Sold)}>Sold</SelectItem>
              <SelectItem value={String(ItemStatus.Archived)}>Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <ItemGrid items={enrichedItems} />
      )}
    </div>
  );
}
