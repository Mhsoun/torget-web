"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import type { ItemBrowseSort, PublicAttributeFilterResponse } from "@/types/torget";

interface BrowseControlsProps {
  filters: PublicAttributeFilterResponse[];
  categoryId?: string;
}

const SORT_OPTIONS: { value: ItemBrowseSort | ""; label: string }[] = [
  { value: "", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A → Z" },
  { value: "name-desc", label: "Name: Z → A" },
];

export default function BrowseControls({ filters, categoryId }: BrowseControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const buildParams = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(overrides)) {
        if (v) {
          next.set(k, v);
        } else {
          next.delete(k);
        }
      }
      return next;
    },
    [searchParams],
  );

  const pushParams = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const params = buildParams(overrides);
      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      });
    },
    [buildParams, router],
  );

  const q = searchParams.get("q") ?? "";
  const sort = (searchParams.get("sort") ?? "") as ItemBrowseSort | "";

  const hasActiveFilters =
    q ||
    sort ||
    filters.some((f) => searchParams.has(`attr_${f.slug}`));

  const clearUrl = categoryId
    ? `?categoryId=${categoryId}`
    : "?";

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-wrap gap-3 items-end">
        {/* Text search */}
        <div className="flex-1 min-w-48">
          <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
          <input
            type="search"
            placeholder="Search items…"
            defaultValue={q}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            onChange={(e) => {
              const val = e.target.value;
              pushParams({ q: val || undefined });
            }}
          />
        </div>

        {/* Sort */}
        <div className="min-w-44">
          <label className="block text-xs font-medium text-gray-500 mb-1">Sort</label>
          <select
            value={sort}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
            onChange={(e) => pushParams({ sort: e.target.value || undefined })}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Attribute filters */}
        {filters.map((filter) => {
          const paramKey = `attr_${filter.slug}`;
          const currentValue = searchParams.get(paramKey) ?? "";

          if (filter.type === "Bool") {
            return (
              <div key={filter.id} className="flex items-end gap-2 min-w-32">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentValue === "true"}
                    className="rounded border-gray-300 text-indigo-600"
                    onChange={(e) =>
                      pushParams({ [paramKey]: e.target.checked ? "true" : undefined })
                    }
                  />
                  {filter.name}
                </label>
              </div>
            );
          }

          if (filter.type === "Enum" && filter.options.length > 0) {
            return (
              <div key={filter.id} className="min-w-40">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {filter.name}
                </label>
                <select
                  value={currentValue}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                  onChange={(e) => pushParams({ [paramKey]: e.target.value || undefined })}
                >
                  <option value="">Any</option>
                  {filter.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (filter.type === "Text" || filter.type === "Number") {
            return (
              <div key={filter.id} className="min-w-36">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {filter.name}
                </label>
                <input
                  type={filter.type === "Number" ? "number" : "text"}
                  placeholder={`Filter by ${filter.name.toLowerCase()}…`}
                  defaultValue={currentValue}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  onChange={(e) =>
                    pushParams({ [paramKey]: e.target.value || undefined })
                  }
                />
              </div>
            );
          }

          return null;
        })}

        {/* Clear link */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <a
              href={clearUrl}
              className="text-sm text-indigo-600 hover:underline whitespace-nowrap"
            >
              Clear filters
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
