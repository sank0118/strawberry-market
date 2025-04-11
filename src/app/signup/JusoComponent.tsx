"use client";

import { Form, useTextInput } from "@/components";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

//! 1. 주소 검색창 폼의 형태 input Enter Tab=> onKeyDown
//? - 주소를 어디서 어떻게 가져올 것인가?
//? - 공공데이터
//? - daum postcode api 사용
//? - 도로공사 주소 api 사용
//? - 대전 중구 중앙로 121 중구 까지만 검색하는 사람들을 위한

//! 2. 주소값들을 선택할 수 있는 무언가 => 팝업 => 모달
//! 3. 상세 주소
//! 4. 닉네임까지 완료 => 주소 추가

//Todo 1. 검색어 검사 입력값이 2단어 이상(띄어쓰기)
// 2. 요청 시 커런트 페이지 + 다음페이지가 있는지 등을 검사 -> 페이지네이션 or 무한스크롤
// 3. button type => button

// const [jusoes,setJusoes] = useStae<Juso>([])
interface Props {
  jusoes: Juso[];
  onChangeJ: (jusoes: Juso[]) => void;
}

const JusoComponent = ({ jusoes, onChangeJ }: Props) => {
  const [items, setItems] = useState(jusoes);
  const [keyword, setKeyword] = useState("");

  const Keyword = useTextInput();

  const keywordMessage = useMemo(() => {
    //!띄어쓰기
    if (keyword.length === 0) {
      return "주소를 입력해주세요.";
    }

    if (keyword.split(" ")[1]?.length === 0) {
      return "주소는 최소 2단어 이상 입력하세요";
    }
    return null;
  }, [keyword]);

  const [isModalShowing, setIsModalShowing] = useState(true);
  //! modal => 평면에 그릴것인지 선택
  const onSearch = useCallback(async () => {
    if (keywordMessage) {
      alert(keywordMessage);
      return Keyword.focus();
    }
    setIsModalShowing(true);

    const url = `${process.env
      .NEXT_PUBLIC_JUSO_API_URL!}&currentPage=${1}&countPerPage=${20}&keyword=${keyword}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.results.common.errorCode !== "0") {
      return alert(data.results.common.errorMessage);
    }
    //items 를 가져온 데이터로 바꾸기
    setItems(data.results.juso as Juso[]);
  }, [keyword, keywordMessage, Keyword]);

  return (
    <div>
      <div className="flex-row items-end">
        <Keyword.TextInput
          value={keyword}
          onChangeText={setKeyword}
          label="'검색어"
          placeholder="대전 중구 중앙로 121"
          containerClassName="flex-1"
          onKeyDown={(e) => {
            const { key, nativeEvent } = e;
            if (key === "Enter" && !nativeEvent.isComposing) {
              onSearch();
            }
          }}
        />
        <button
          className="primary size-12 text-2xl"
          type="button"
          onClick={onSearch}
        >
          <IoSearchOutline />
        </button>
      </div>

      {/* modal */}
      {true && (
        <div className="fixed top-0 lefr-0 w-full h-screen z-50 bg-black/3 justify-end items-center">
          <div className="bg-white border border-gray-200 border-b-0 h-[90%] w-[calc(100%-40px)] rounded-t-2xl p-5 ">
            modal
            <Form className="flex flex-row gap-x-2.5">
              <Keyword.TextInput
                value={keyword}
                name="keyword"
                placeholder="주소를 입력하세요."
                onChange={onSearch}
              />
              <button className="primary" type="button">
                <IoSearchOutline />
              </button>
            </Form>
          </div>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                {item.roadAddr} {item.zipNo}
              </li>
            ))}
          </ul>
          <span />
        </div>
      )}
    </div>
  );
};

export default JusoComponent;
