import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export default async function noUserMiddleware(req: NextRequest) {
  //! 우저라면 되돌려주기
  const cookieStroe = await cookies();
  const token = cookieStroe.get("idToken");
  console.log("유저토큰을 검사합니다.");
  if (!token) {
    console.log("유저가 아님");
    return NextResponse.next();
  }
  const idToken = token.value;
  console.log("아이디 토큰을 검사랍니다.");
  if (!idToken || idToken.length === 0) {
    return NextResponse.next();
  }
  //! 안됨
  console.log("유저입니다.. 돌아가세요");

  return NextResponse.redirect(
    new URL(
      "/",
      req.url ||
        req.nextUrl.host ||
        process.env.HOST_URL ||
        "http://localhost:3000"
    )
  );
}
