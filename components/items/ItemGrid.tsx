import { AlertCircle, PackageSearch } from "lucide-react";
import { ItemCard } from "./ItemCard";
import { ItemResponse } from "@/types/torget";

interface ItemGridProps {
  items: ItemResponse[];
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
}

const SKELETON_COUNT = 8;

function CardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-card ring-1 ring-foreground/10 animate-pulse">
      <div className="w-full aspect-[4/3] bg-muted" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-4/5" />
        <div className="h-3 bg-muted rounded w-2/3" />
      </div>
      <div className="px-4 pb-4 flex justify-between">
        <div className="h-5 bg-muted rounded w-16" />
        <div className="h-5 bg-muted rounded w-12" />
      </div>
    </div>
  );
}

export function ItemGrid({
  items,
  isLoading,
  error,
  emptyMessage = "No items found",
}: ItemGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertCircle className="w-6 h-6 text-destructive" />
        </div>
        <p className="text-sm font-medium text-destructive">
          Could not load items
        </p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Something went wrong while fetching listings. Please try again.
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <div className="rounded-full bg-muted p-3">
          <PackageSearch className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-base font-medium">{emptyMessage}</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Try adjusting the filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
