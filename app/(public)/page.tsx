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

  const {
    data: items = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["items", { categoryId, status }],
    queryFn: () => getItems({ categoryId, status }),
  });

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Browse items</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Category
            </span>
            <Select
              value={categoryId ?? "all"}
              onValueChange={(v) =>
                setCategoryId(v === "all" ? undefined : v ?? undefined)
              }
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All categories" />
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
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Status
            </span>
            <Select
              value={status !== undefined ? String(status) : "all"}
              onValueChange={(v) =>
                setStatus(v === "all" ? undefined : (Number(v) as ItemStatus))
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All statuses" />
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
      </div>

      <ItemGrid
        items={items}
        isLoading={isLoading}
        error={isError ? "Failed to load items." : null}
      />
    </div>
  );
}
