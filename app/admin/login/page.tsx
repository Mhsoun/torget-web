import { getCachedBusinessConfig } from "@/lib/config";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const config = await getCachedBusinessConfig();

  return <LoginForm adminTitle={`${config.name} Admin`} />;
}
