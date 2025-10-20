// middleware.ts (project root)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PREFIXES = [
  "/",                 // homepage stays public
  "/auth/signin",      // signin page
  "/auth/signup",      // signup page
  "/api/auth",         // NextAuth internal routes
  "/_next",            // Next.js internal assets
  "/favicon.ico",      // favicon
  "/images",           // any public static you might have
  "/assets",           // any public static you might have
];

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // allow public routes
  if (PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // check auth token (NextAuth JWT)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const redirectUrl = new URL("/auth/signin", req.url);
    redirectUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

// run on basically everything except static assets
export const config = {
  matcher: ["/((?!.*\\.(?:png|jpg|jpeg|gif|svg|ico|css|js|map)|_next|favicon.ico).*)"],
};
