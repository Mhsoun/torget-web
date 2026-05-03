import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export function sanitizeAdminCallbackUrl(raw?: string | null): string {
  if (!raw) {
    return "/admin/dashboard";
  }

  const decoded = decodeURIComponent(raw);
  if (!decoded.startsWith("/admin")) {
    return "/admin/dashboard";
  }

  // Prevent protocol-relative and external redirects.
  if (decoded.startsWith("//") || decoded.includes("://")) {
    return "/admin/dashboard";
  }

  return decoded;
}

export function buildAdminLoginRedirect(callbackUrl: string): string {
  const safe = sanitizeAdminCallbackUrl(callbackUrl);
  return `/admin/login?callbackUrl=${encodeURIComponent(safe)}`;
}

export async function requireAdminAccessToken(callbackUrl = "/admin/dashboard"): Promise<string> {
  const session = await auth();

  if (!session?.accessToken || session.authError === "token_expired") {
    redirect(buildAdminLoginRedirect(callbackUrl));
  }

  return session.accessToken;
}
