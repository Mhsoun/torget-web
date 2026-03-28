import { notFound } from "next/navigation";
import { getItem } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { ItemImage } from "@/components/items/ItemImage";
import { ITEM_STATUS_LABELS } from "@/types/torget";
import { formatPrice, formatDate, statusBadgeVariant } from "@/lib/formatters";
import Link from "next/link";

interface ItemDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { id } = await params;

  let item;
  try {
    item = await getItem(id);
  } catch {
    notFound();
  }

  const galleryImages = item.images ?? [];
  const hasMultipleImages = galleryImages.length > 1;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to listing
      </Link>

      <ItemImage
        src={item.primaryImageUrl}
        alt={item.name}
        className="rounded-xl overflow-hidden"
      />

      {hasMultipleImages && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {galleryImages.map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt={img.altText ?? item.name}
              className="h-16 w-24 object-cover rounded-md flex-shrink-0 ring-1 ring-foreground/10"
            />
          ))}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold leading-tight">{item.name}</h1>
          <Badge variant={statusBadgeVariant(item.status)}>
            {ITEM_STATUS_LABELS[item.status]}
          </Badge>
        </div>

        <p className="text-3xl font-semibold text-primary">
          {formatPrice(item.price)}
        </p>

        {item.description && (
          <p className="text-muted-foreground leading-relaxed">
            {item.description}
          </p>
        )}

        {item.categoryName && (
          <p className="text-sm text-muted-foreground">
            Category:{" "}
            <span className="font-medium text-foreground">{item.categoryName}</span>
          </p>
        )}

        {item.attributes && item.attributes.length > 0 && (
          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Specifications
            </h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              {item.attributes.map((attr) => (
                <>
                  <dt key={`k-${attr.attributeId}`} className="text-muted-foreground">{attr.name}</dt>
                  <dd key={`v-${attr.attributeId}`} className="font-medium">{attr.label}</dd>
                </>
              ))}
            </dl>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Listed {formatDate(item.createdAtUtc)}
        </p>
      </div>
    </div>
  );
}
