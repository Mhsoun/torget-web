import { notFound } from "next/navigation";
import { getItem, getCategories } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { ITEM_STATUS_LABELS, ItemStatus } from "@/types/torget";
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

  let categoryName: string | undefined;
  if (item.categoryId) {
    try {
      const categories = await getCategories();
      categoryName = categories.find((c) => c.id === item.categoryId)?.name;
    } catch {
      // best effort
    }
  }

  const price = new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
  }).format(item.price);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to listing
      </Link>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold">{item.name}</h1>
          <Badge
            variant={item.status === ItemStatus.Active ? "default" : "secondary"}
          >
            {ITEM_STATUS_LABELS[item.status]}
          </Badge>
        </div>
        <p className="text-3xl font-semibold text-primary">{price}</p>
        {categoryName && (
          <p className="text-muted-foreground">
            Category:{" "}
            <span className="font-medium text-foreground">{categoryName}</span>
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          Listed{" "}
          {new Intl.DateTimeFormat("en-GB", {
            dateStyle: "medium",
          }).format(new Date(item.createdAtUtc))}
        </p>
      </div>
    </div>
  );
}
