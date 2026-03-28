import Link from "next/link";
import type { CategoryResponse } from "@/types/torget";
import { getCategories } from "@/lib/api";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: CategoryResponse[] = [];
  try {
    categories = await getCategories();
  } catch {
    // Categories unavailable — show nav without them
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Torget
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              All items
            </Link>
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Torget
      </footer>
    </div>
  );
}
