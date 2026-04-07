"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getItems, getPublicBrowseFilters } from "@/lib/api";
import { ItemGrid } from "@/components/items/ItemGrid";
import type { ItemBrowseSort } from "@/types/torget";
import BrowseControls from "@/components/browse/BrowseControls";

interface BrowseHomePageProps {
  showPrices?: boolean;
}

export default function BrowseHomePage({ showPrices = true }: BrowseHomePageProps) {
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? undefined;
  const sort = (searchParams.get("sort") ?? undefined) as ItemBrowseSort | undefined;
  const categoryId = searchParams.get("categoryId") ?? undefined;

  const attributeFilters: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith("attr_")) {
      attributeFilters[key.slice(5)] = value;
    }
  }

  const { data: filters = [] } = useQuery({
    queryKey: ["browse-filters"],
    queryFn: getPublicBrowseFilters,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: items = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["items", { q, sort, categoryId, attributeFilters }],
    queryFn: () =>
      getItems({
        q,
        sort,
        categoryId,
        attributeFilters: Object.keys(attributeFilters).length > 0 ? attributeFilters : undefined,
      }),
  });

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Browse items</h1>
        <BrowseControls filters={filters} />
      </div>

      <ItemGrid
        items={items}
        isLoading={isLoading}
        error={isError ? "Failed to load items." : null}
        emptyMessage="No items found"
        emptySecondary={q || categoryId || Object.keys(attributeFilters).length > 0
          ? "Try adjusting the filters or check back later."
          : "Check back soon — new listings will appear here."}
        showPrices={showPrices}
      />
    </div>
  );
}
