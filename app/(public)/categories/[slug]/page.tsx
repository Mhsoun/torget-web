import { notFound } from "next/navigation";
import type { ItemResponse } from "@/types/torget";
import { getCategories, getItems } from "@/lib/api";
import { ItemGrid } from "@/components/items/ItemGrid";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  let category;
  try {
    const categories = await getCategories();
    category = categories.find((c) => c.slug === slug);
  } catch {
    notFound();
  }

  if (!category) {
    notFound();
  }

  let items: ItemResponse[] = [];
  try {
    items = await getItems({ categoryId: category.id });
  } catch {
    // return empty grid
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{category.name}</h1>
      <ItemGrid items={items} emptyMessage={`No items in ${category.name} yet.`} />
    </div>
  );
}
