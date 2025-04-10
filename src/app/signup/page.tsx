import noUserMiddleware from "@/middlewares/noUser.middle";
import Signup from "./Signup";
import { NextResponse } from "next/server";
import Link from "next/link";

const SignupPage = async () => {
  const res = await noUserMiddleware();

  if (!res.success) {
    return (
      <div>
        <h1>접근이 제한된 페이지입니다.</h1>
        <Link href={"/"}>홈으로 돌아가기</Link>
      </div>
    );
  }

  return <Signup />;
};

export default SignupPage;
