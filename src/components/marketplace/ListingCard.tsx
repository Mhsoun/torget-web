"use client";

import Link from "next/link";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/src/components/ui/card";
import { ItemImage } from "@/components/items/ItemImage";
import { cn } from "@/lib/utils";
import type { ListingCardProps } from "./types";

export function ListingCard({
  href,
  title,
  price,
  imageUrl,
  location,
  category,
  condition,
  status,
}: ListingCardProps) {
  return (
    <Card className="h-full border-border bg-card text-card-foreground transition-all hover:ring-2 hover:ring-primary/20 hover:shadow-lg">
      <Link href={href} className="block group">
        <ItemImage src={imageUrl} alt={title} />
      </Link>

      <CardContent className="space-y-1 pt-3">
        {category?.name ? (
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {category.href ? (
              <Link href={category.href} className="transition-colors hover:text-foreground">
                {category.name}
              </Link>
            ) : (
              category.name
            )}
          </p>
        ) : null}

        <Link href={href} className="block transition-colors hover:text-primary">
          <p className="line-clamp-2 text-sm font-medium leading-snug">{title}</p>
        </Link>

        {location ? <p className="text-xs text-muted-foreground">{location}</p> : null}
      </CardContent>

      <CardFooter className="flex items-center gap-2">
        {price ? <span className="text-base font-semibold text-primary">{price}</span> : null}

        {(condition || status) && (
          <Badge
            variant="secondary"
            className={cn("ml-1", condition && !status ? "text-muted-foreground" : undefined)}
          >
            {status ?? condition}
          </Badge>
        )}

        <Link
          href={href}
          className="ml-auto text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          View details
        </Link>
      </CardFooter>
    </Card>
  );
}
