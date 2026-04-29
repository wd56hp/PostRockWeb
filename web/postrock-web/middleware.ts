import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const HOST_ROUTES: Record<string, string> = {
  "smokyhillsag.com": "/smoky-hills-agronomy",
  "www.smokyhillsag.com": "/smoky-hills-agronomy",
  "prairieenergyllc.com": "/smoky-hills-agronomy",
  "www.prairieenergyllc.com": "/smoky-hills-agronomy",
};

export function middleware(request: NextRequest) {
  const host = request.nextUrl.hostname.toLowerCase();
  const rewritePath = HOST_ROUTES[host];

  if (rewritePath) {
    const url = request.nextUrl.clone();
    url.pathname = rewritePath;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, icon.png, etc.
     * - public folder (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.png|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
