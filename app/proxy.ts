import { NextResponse } from "next/server";
import { getSession } from "./utils/get-session";
import { PUBLIC_ROUTES } from "./constants/public-routes";

import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.some((route) => {
    return pathname === route || pathname.startsWith(`${route}/`);
  });

  const { user } = await getSession();
  const isAuthenticated = !!user;
  console.log("isAuthenticated", isAuthenticated);

  if (!isAuthenticated && !isPublicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthenticated && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/customer", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Corresponde a todos os caminhos de solicitação, exceto aqueles que começam com:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
