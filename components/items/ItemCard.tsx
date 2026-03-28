import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItemImage } from "@/components/items/ItemImage";
import { ITEM_STATUS_LABELS, ItemResponse } from "@/types/torget";
import { formatPrice, statusBadgeVariant } from "@/lib/formatters";

interface ItemCardProps {
  item: ItemResponse;
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Link href={`/items/${item.id}`} className="block group">
      <Card className="h-full transition-all group-hover:ring-2 group-hover:ring-primary/20 group-hover:shadow-lg cursor-pointer">
        <ItemImage src={item.primaryImageUrl} alt={item.name} />
        <CardContent className="pt-3 space-y-1">
          {item.categoryName && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {item.categoryName}
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
        <CardFooter className="flex items-center justify-between gap-2">
          <span className="text-base font-semibold text-primary">
            {formatPrice(item.price)}
          </span>
          <Badge variant={statusBadgeVariant(item.status)}>
            {ITEM_STATUS_LABELS[item.status]}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
