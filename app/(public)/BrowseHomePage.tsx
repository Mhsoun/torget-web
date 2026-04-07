"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
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

  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7268/ingest/5a5cc7fb-dc54-4f3b-8e40-459b194f7edd", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "1a99c7" },
      body: JSON.stringify({
        sessionId: "1a99c7",
        runId: "run-1",
        hypothesisId: "H1",
        location: "app/(public)/BrowseHomePage.tsx:54",
        message: "Browse page mounted for debug session",
        data: {
          q: q ?? null,
          sort: sort ?? null,
          categoryId: categoryId ?? null,
          itemCount: items.length,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    const logo = document.querySelector('img[src*="/brands/torget/logo.svg"]') as HTMLImageElement | null;
    // #region agent log
    fetch("http://127.0.0.1:7268/ingest/5a5cc7fb-dc54-4f3b-8e40-459b194f7edd", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "1a99c7" },
      body: JSON.stringify({
        sessionId: "1a99c7",
        runId: "run-1",
        hypothesisId: "H2",
        location: "app/(public)/BrowseHomePage.tsx:75",
        message: "Logo runtime sizing snapshot",
        data: logo
          ? {
              attrWidth: logo.getAttribute("width"),
              attrHeight: logo.getAttribute("height"),
              inlineWidth: logo.style.width || null,
              inlineHeight: logo.style.height || null,
              computedWidth: window.getComputedStyle(logo).width,
              computedHeight: window.getComputedStyle(logo).height,
            }
          : { logoFound: false },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [categoryId, items.length, q, sort]);

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
