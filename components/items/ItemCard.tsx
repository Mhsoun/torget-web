import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItemImage } from "@/components/items/ItemImage";
import { ITEM_STATUS_LABELS, ItemResponse } from "@/types/torget";
import { formatPrice, statusBadgeVariant } from "@/lib/formatters";

let hasLoggedSessionDebugProbe = false;

interface ItemCardProps {
  item: ItemResponse;
  showPrices?: boolean;
}

export function ItemCard({ item, showPrices = true }: ItemCardProps) {
  const hasCategoryLink = Boolean(item.categoryName && item.categorySlug);
  const wrapsCardInOuterLink = false;

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
    <Card className="h-full transition-all hover:ring-2 hover:ring-primary/20 hover:shadow-lg">
      <Link href={`/items/${item.id}`} className="block group">
        <ItemImage src={item.primaryImageUrl} alt={item.name} />
      </Link>
        <CardContent className="pt-3 space-y-1">
          {item.categoryName && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {item.categorySlug ? (
                <Link
                  href={`/categories/${item.categorySlug}`}
                  className="hover:text-foreground transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.categoryName}
                </Link>
              ) : (
                item.categoryName
              )}
            </p>
          )}
          <Link
            href={`/items/${item.id}`}
            className="block hover:text-primary transition-colors"
          >
            <p className="text-sm font-medium line-clamp-2 leading-snug">
              {item.name}
            </p>
          </Link>
          {item.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </CardContent>
        <CardFooter className={cn("flex items-center gap-2", showPrices ? "justify-between" : "justify-start")}>
          {showPrices && (
            <span className="text-base font-semibold text-primary">
              {formatPrice(item.price)}
            </span>
          )}
          <Badge variant={statusBadgeVariant(item.status)}>
            {ITEM_STATUS_LABELS[item.status]}
          </Badge>
          <Link
            href={`/items/${item.id}`}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View details
          </Link>
        </CardFooter>
    </Card>
  );
}
