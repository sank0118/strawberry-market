//! 유저인데 본인일떄만 방문할 수 있는 페이지 검사

import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default async function onlyMyMiddlewar(req: NextRequest) {
  //쿠키 검사
  const cookieStore = await cookies();
  const token = cookieStore.get("idToken");

  const redirect = (path: string = "/") =>
    NextResponse.redirect(
      new URL(path, req.url || req.nextUrl.host || process.env.HOST_URL)
    );

  //! 유저가 로그인했는지 검사
  console.log("유저가 로그인했는지 검사합니다.");
  if (!token) {
    return redirect("/signin");
  }

  const idToken = token.value;
  if (!idToken || idToken.length === 0) {
    return redirect("/signin");
  }
  console.log("환영합니다. 본인인지 확인할게요");

  //파이어베이스에 확인
  try {
    const { data } = await axios.post(process.env.NEXT_PUBLIC_FB_URL!, {
      idToken,
    });
    if (!data) {
      console.log("오류뜸");

      return redirect();
    }
    if (!data || data.users.length === 0) {
      console.log("존재하지 않는 유조시네요");

      return redirect();
    }

    const uid = req.nextUrl.pathname.split("/")[1];

    if (!uid || uid.length === 0) {
      console.log("주소 확인 ㄱㄱ");

      return redirect();
    }

    //@ts-ignore
    const foundUser = data.users.find((user) => user.localId === uid);

    if (!foundUser) {
      console.log("본인이 아닙니다.");

      return redirect();
    }

    //통과하면 그 때 next 아니면 redirect
    console.log("통과!!");

    return NextResponse.next();
  } catch (error: any) {
    console.log("오류뜸 ", error.message);

    return redirect();
  }
}
