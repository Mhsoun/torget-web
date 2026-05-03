import { ITEM_STATUS_LABELS, ItemResponse } from "@/types/torget";
import { formatPrice } from "@/lib/formatters";
import { ListingCard } from "@/src/components/marketplace/ListingCard";

interface ItemCardProps {
  item: ItemResponse;
  showPrices?: boolean;
}

export function ItemCard({ item, showPrices = true }: ItemCardProps) {
  return (
    <ListingCard
      id={item.id}
      href={`/items/${item.id}`}
      title={item.name}
      price={showPrices ? formatPrice(item.price) : ""}
      imageUrl={item.primaryImageUrl}
      category={
        item.categoryName
          ? {
              name: item.categoryName,
              href: item.categorySlug ? `/categories/${item.categorySlug}` : undefined,
            }
          : undefined
      }
      status={ITEM_STATUS_LABELS[item.status]}
    />
  );
}
