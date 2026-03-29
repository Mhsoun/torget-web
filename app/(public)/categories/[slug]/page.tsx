import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/api";
import { getCachedBusinessConfig } from "@/lib/config";
import CategoryBrowsePage from "./CategoryBrowsePage";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  let category;
  try {
    category = await getCategoryBySlug(slug);
  } catch {
    notFound();
  }

  if (!category) {
    notFound();
  }

  const config = await getCachedBusinessConfig();
  const showPrices = config.features.showPrices;

  return <CategoryBrowsePage category={category} showPrices={showPrices} />;
}
