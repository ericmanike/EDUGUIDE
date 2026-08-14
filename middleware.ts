import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export interface JwtTokenPayload {
  id?: string;
  email?: string;
  role?: "STUDENT" | "ADMIN";
  name?: string;
  sub?: string;
  exp?: number;
}

function decodeJwtPayload(token: string): JwtTokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect ALL dashboard routes (/dashboard*) from unauthenticated users
  if (pathname.startsWith("/dashboard")) {
    const token =
      request.cookies.get("token")?.value ||
      request.cookies.get("edtech_token")?.value ||
      request.cookies.get("jwt")?.value ||
      request.cookies.get("accessToken")?.value;

    if (!token) {
      // Redirect unauthenticated user to login page
      const loginUrl = new URL("/auth/signIn", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = decodeJwtPayload(token);

    // Check token expiration
    if (payload?.exp && payload.exp * 1000 < Date.now()) {
      const loginUrl = new URL("/auth/signIn", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Protect curriculum manager & admin routes from non-ADMIN users
    if (pathname.startsWith("/dashboard/curriculum") || pathname.startsWith("/dashboard/admin")) {
      if (payload?.role !== "ADMIN") {
        const dashboardUrl = new URL("/dashboard", request.url);
        dashboardUrl.searchParams.set("unauthorized", "admin");
        return NextResponse.redirect(dashboardUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
