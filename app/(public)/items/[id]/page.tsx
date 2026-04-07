import { Fragment } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getItem } from "@/lib/api";
import { getCachedBusinessConfig } from "@/lib/config";
import { Badge } from "@/components/ui/badge";
import { ItemImage } from "@/components/items/ItemImage";
import { InquiryForm } from "@/components/public/InquiryForm";
import { ITEM_STATUS_LABELS } from "@/types/torget";
import { formatPrice, formatDate, statusBadgeVariant } from "@/lib/formatters";
import Link from "next/link";

interface ItemDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { id } = await params;

  const [itemResult, config] = await Promise.allSettled([
    getItem(id),
    getCachedBusinessConfig(),
  ]);

  if (itemResult.status === "rejected") {
    notFound();
  }

  const item = itemResult.value;
  const showInquiries =
    config.status === "fulfilled" ? config.value.features.showInquiries : true;
  const showPrices =
    config.status === "fulfilled" ? config.value.features.showPrices : true;

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
            <Image
              key={img.id}
              src={img.url}
              alt={img.altText ?? item.name}
              width={96}
              height={64}
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

        {showPrices && (
          <p className="text-3xl font-semibold text-primary">
            {formatPrice(item.price)}
          </p>
        )}

        {item.description && (
          <p className="text-muted-foreground leading-relaxed">
            {item.description}
          </p>
        )}

        {item.categoryName && (
          <p className="text-sm text-muted-foreground">
            Category:{" "}
            {item.categorySlug ? (
              <Link
                href={`/categories/${item.categorySlug}`}
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                {item.categoryName}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{item.categoryName}</span>
            )}
          </p>
        )}

        {item.attributes && item.attributes.length > 0 && (
          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Specifications
            </h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              {item.attributes.map((attr) => (
                <Fragment key={attr.attributeId}>
                  <dt className="text-muted-foreground">{attr.name}</dt>
                  <dd className="font-medium">{attr.label}</dd>
                </Fragment>
              ))}
            </dl>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Listed {formatDate(item.createdAtUtc)}
        </p>
      </div>

      {showInquiries && <InquiryForm itemId={item.id} />}
    </div>
  );
}
