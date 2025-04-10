import { NextRequest, NextResponse } from "next/server";
import noUserMiddleware from "./middlewares/noUser.middle";
import onlyMyMiddlewar from "./middlewares/onlyMy.middle";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/signin") || pathname.startsWith("/signup")) {
    console.log("로그인/회원가입 page middleware");
    return await noUserMiddleware(req);
  }
  console.log("유저 확인 middleware");
  return await onlyMyMiddlewar(req);
}

export const config = {
  matcher: ["/signin", "/signup", "/:uid/:path*"],
};
