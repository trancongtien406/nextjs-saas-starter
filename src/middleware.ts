import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";

export async function middleware(req: NextRequest) {
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/dashboard") && !session) {
    const url = new URL("/sign-in", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if ((pathname === "/sign-in" || pathname === "/sign-up") && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"] };
