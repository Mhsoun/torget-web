import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ITEM_STATUS_LABELS, ItemResponse, ItemStatus } from "@/types/torget";

interface ItemCardProps {
  item: ItemResponse & { status?: ItemStatus; categoryName?: string };
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Link href={`/items/${item.id}`} className="block group">
      <Card className="h-full transition-shadow group-hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-base line-clamp-2">{item.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {item.categoryName && (
            <p className="text-sm text-muted-foreground mb-2">{item.categoryName}</p>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-lg font-semibold">
            {new Intl.NumberFormat("nb-NO", {
              style: "currency",
              currency: "NOK",
            }).format(item.price)}
          </span>
          {item.status !== undefined && (
            <Badge variant={item.status === ItemStatus.Active ? "default" : "secondary"}>
              {ITEM_STATUS_LABELS[item.status]}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
