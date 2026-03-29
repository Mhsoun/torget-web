import Link from "next/link";
import { getCachedBusinessConfig } from "@/lib/config";

export default async function NotFound() {
  const config = await getCachedBusinessConfig();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <p className="text-8xl font-bold text-muted-foreground/40">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        ← Back to {config.name}
      </Link>
    </div>
  );
}
