import { redirect } from "next/navigation";
import { getCachedBusinessConfig } from "@/lib/config";
import { auth } from "@/lib/auth";
import { sanitizeAdminCallbackUrl } from "@/lib/admin-session";
import { LoginForm } from "./LoginForm";

interface LoginPageProps {
  searchParams?: Promise<{ callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const callbackUrl = sanitizeAdminCallbackUrl(params?.callbackUrl);
  const session = await auth();

  if (session?.accessToken && session.authError !== "token_expired") {
    redirect(callbackUrl);
  }

  const config = await getCachedBusinessConfig();

  return <LoginForm adminTitle={`${config.name} Admin`} callbackUrl={callbackUrl} />;
}
