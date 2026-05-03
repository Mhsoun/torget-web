import { Suspense } from "react";
import { getCachedBusinessConfig } from "@/lib/config";
import BrowseHomePage from "./BrowseHomePage";

export default async function HomePage() {
  const config = await getCachedBusinessConfig();
  return (
    <Suspense fallback={<div className="py-8 text-sm text-muted-foreground">Loading listings…</div>}>
      <BrowseHomePage showPrices={config.features.showPrices} />
    </Suspense>
  );
}
