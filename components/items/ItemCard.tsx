import { ITEM_STATUS_LABELS, ItemResponse } from "@/types/torget";
import { formatPrice } from "@/lib/formatters";
import { ListingCard } from "@/src/components/marketplace/ListingCard";

let hasLoggedSessionDebugProbe = false;

interface ItemCardProps {
  item: ItemResponse;
  showPrices?: boolean;
}

export function ItemCard({ item, showPrices = true }: ItemCardProps) {
  const hasCategoryLink = Boolean(item.categoryName && item.categorySlug);

  if (!hasLoggedSessionDebugProbe && typeof window !== "undefined") {
    hasLoggedSessionDebugProbe = true;
    // #region agent log
    fetch("http://127.0.0.1:7268/ingest/5a5cc7fb-dc54-4f3b-8e40-459b194f7edd", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "1a99c7" },
      body: JSON.stringify({
        sessionId: "1a99c7",
        runId: "run-1",
        hypothesisId: "H3",
        location: "components/items/ItemCard.tsx:24",
        message: "ItemCard mounted; legacy debug fetch path active",
        data: {
          itemId: item.id,
          hasCategoryLink,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }

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
