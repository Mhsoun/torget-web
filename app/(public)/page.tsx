import { getCachedBusinessConfig } from "@/lib/config";
import BrowseHomePage from "./BrowseHomePage";

export default async function HomePage() {
  const config = await getCachedBusinessConfig();
  return <BrowseHomePage showPrices={config.features.showPrices} />;
}
