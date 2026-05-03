"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { buildAdminLoginRedirect } from "@/lib/admin-session";

export function useAdminAccessToken() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const callbackUrl = useMemo(() => {
    const query = searchParams.toString();
    return `${pathname}${query ? `?${query}` : ""}`;
  }, [pathname, searchParams]);

  useEffect(() => {
    const shouldRedirect =
      status === "unauthenticated" ||
      (status === "authenticated" && (!session?.accessToken || session.authError === "token_expired"));

    if (shouldRedirect) {
      router.replace(buildAdminLoginRedirect(callbackUrl));
    }
  }, [callbackUrl, router, session?.accessToken, session?.authError, status]);

  return {
    token: session?.accessToken ?? "",
    isSessionLoading: status === "loading",
    isAuthenticated: status === "authenticated" && !!session?.accessToken && session.authError !== "token_expired",
    callbackUrl,
  };
}
