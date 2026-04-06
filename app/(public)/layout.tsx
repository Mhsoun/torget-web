import Link from "next/link";
import Image from "next/image";
import type { CategoryResponse } from "@/types/torget";
import { getCategories } from "@/lib/api";
import { getCachedBusinessConfig } from "@/lib/config";
import { getBrand } from "@/lib/themes";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { PublicLayoutDebugProbe } from "@/components/debug/PublicLayoutDebugProbe";

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

  const config = await getCachedBusinessConfig();
  const brand = getBrand(config.brandKey);
  const showLogo = !!brand.logoPath;
  // #region agent log
  fetch("http://127.0.0.1:7268/ingest/5a5cc7fb-dc54-4f3b-8e40-459b194f7edd", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "1a99c7" },
    body: JSON.stringify({
      sessionId: "1a99c7",
      runId: "run-verify",
      hypothesisId: "H7",
      location: "app/(public)/layout.tsx:25",
      message: "Public layout rendered on server",
      data: {
        brandKey: config.brandKey,
        showLogo,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  return (
    <div className="min-h-screen flex flex-col">
      <PublicLayoutDebugProbe />
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            {showLogo ? (
              <Image
                src={brand.logoPath!}
                alt={config.name}
                width={117}
                height={32}
                priority
              />
            ) : (
              <span>{config.name}</span>
            )}
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              All items
            </Link>
            {config.features.showCategories && categories.slice(0, 5).map((cat) => (
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
        © {new Date().getFullYear()} {config.name}
      </footer>
    </div>
  );
}
