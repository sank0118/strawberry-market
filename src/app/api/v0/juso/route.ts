import axios from "axios";
import { response } from "@/lib";

export async function POST(req: Request) {
  const body = await req.json(); // body
  console.log(body, 6);
  const { keyword, currentPage, countPerPage } = body;
  if (!keyword) {
    return response.error("주소 검색어를 입력해주세요.");
  }
  if (!currentPage || !countPerPage) {
    return response.error("파라미터값을 확인해주세요.");
  }

  try {
    // # ?currentPage=1&countPerPage =10&keyword=인천 남구 주안동 125&confmKey=승인키&hstryYn=Y
    const { data } = await axios.get(process.env.NEXT_PUBLIC_JUSO_API_URL!, {
      params: {
        keyword,
        countPerPage,
        currentPage,
        resultType: "json",
        confmKey: process.env.NEXT_PUBLIC_JUSO_API_KEY,
      },
    });

    // juso api error message handler
    if (data.results.common.errorCode !== "0") {
      return response.error(data.results.common.errorMessage);
    }

    // Juso[]
    return response.success(data.results.juso);
  } catch (error: any) {
    return response.error(error.message);
  }
}
