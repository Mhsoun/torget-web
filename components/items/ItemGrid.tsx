import { ItemCard } from "./ItemCard";
import { ItemResponse, ItemStatus } from "@/types/torget";

interface ItemGridProps {
  items: (ItemResponse & { status?: ItemStatus; categoryName?: string })[];
  emptyMessage?: string;
}

export function ItemGrid({ items, emptyMessage = "No items found." }: ItemGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg">{emptyMessage}</p>
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
