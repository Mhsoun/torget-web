"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getItems, getPublicBrowseFilters } from "@/lib/api";
import { ItemGrid } from "@/components/items/ItemGrid";
import BrowseControls from "@/components/browse/BrowseControls";
import type { CategoryResponse, ItemBrowseSort } from "@/types/torget";

interface CategoryBrowsePageProps {
  category: CategoryResponse;
  showPrices?: boolean;
}

export default function CategoryBrowsePage({ category, showPrices = true }: CategoryBrowsePageProps) {
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? undefined;
  const sort = (searchParams.get("sort") ?? undefined) as ItemBrowseSort | undefined;

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
    queryKey: ["items", { q, sort, categoryId: category.id, attributeFilters }],
    queryFn: () =>
      getItems({
        q,
        sort,
        categoryId: category.id,
        attributeFilters: Object.keys(attributeFilters).length > 0 ? attributeFilters : undefined,
      }),
  });

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Browse all items
      </Link>
      <h1 className="text-3xl font-bold">{category.name}</h1>
      <BrowseControls filters={filters} categoryId={category.id} />
      <ItemGrid
        items={items}
        isLoading={isLoading}
        error={isError ? "Could not load items for this category." : null}
        emptyMessage={`No items in ${category.name} yet.`}
        showPrices={showPrices}
      />
    </div>
  );
}
