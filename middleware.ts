import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sanitizeAdminCallbackUrl } from "@/lib/admin-session";

export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";
  const isProtectedAdminRoute = isAdminRoute && !isLoginRoute;
  const hasSessionToken = Boolean(req.auth?.accessToken);

  if (isProtectedAdminRoute && !hasSessionToken) {
    const callbackUrl = sanitizeAdminCallbackUrl(`${pathname}${search}`);
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && hasSessionToken) {
    const requested = req.nextUrl.searchParams.get("callbackUrl");
    const target = sanitizeAdminCallbackUrl(requested);
    return NextResponse.redirect(new URL(target, req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
