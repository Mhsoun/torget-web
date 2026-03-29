import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItemImage } from "@/components/items/ItemImage";
import { ITEM_STATUS_LABELS, ItemResponse } from "@/types/torget";
import { formatPrice, statusBadgeVariant } from "@/lib/formatters";

interface ItemCardProps {
  item: ItemResponse;
  showPrices?: boolean;
}

export function ItemCard({ item, showPrices = true }: ItemCardProps) {
  return (
    <Link href={`/items/${item.id}`} className="block group">
      <Card className="h-full transition-all group-hover:ring-2 group-hover:ring-primary/20 group-hover:shadow-lg cursor-pointer">
        <ItemImage src={item.primaryImageUrl} alt={item.name} />
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
          <p className="text-sm font-medium line-clamp-2 leading-snug">
            {item.name}
          </p>
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
        </CardFooter>
      </Card>
    </Link>
  );
}
