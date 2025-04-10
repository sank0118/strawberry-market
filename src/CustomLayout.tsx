"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { IconType } from "react-icons";
import { GiStrawberry } from "react-icons/gi";
import {
  IoHomeOutline,
  IoPersonAddOutline,
  IoPersonOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { useTextInput } from "./components";

const user = null;
const CustomLayout = ({ children }: PropsWithChildren) => {
  interface Menu {
    name: string;
    href: string; //경로
    Icon: IconType; // <IconName/> (XX) //? ==>IconName(OO)
  }

  const menus = useMemo<Menu[]>(() => {
    const items: Menu[] = [];

    const home: Menu = {
      name: "홈",
      href: "/",
      Icon: IoHomeOutline,
    };

    const serach: Menu = {
      name: "검색",
      href: "",
      Icon: IoSearchOutline,
    };

    if (!user) {
      items.push(
        { name: "로그인", href: "/signin", Icon: IoPersonOutline },
        home,
        { name: "회원가입", href: "/signup", Icon: IoPersonAddOutline },
        serach
      );
    } else {
    }
    return items;
  }, []);

  const pathname = usePathname();
  const Keyword = useTextInput();

  const ref = useRef<HTMLInputElement>(null);

  const focus = useCallback(
    () => setTimeout(() => ref.current?.focus(), 100),
    []
  );

  const [keyword, setKeyword] = useState("");

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white z-10 border-b border-gray-200">
        <div className="flex-row gap-0">
          <Link
            href="/"
            className="text-xl gap-x-2.5s text-theme font-black h-15"
          >
            <GiStrawberry className="text-3xl" />{" "}
            {!Keyword.focused && "딸기마켓"}
          </Link>

          <Keyword.TextInput
            value={keyword}
            onChangeText={setKeyword}
            placeholder="검색어를 입력해주세요."
            onKeyDown={(e) => {
              const { key, nativeEvent } = e;
              if (key === "Enter" && !nativeEvent.isComposing) {
                if (keyword.length === 0) {
                  alert("검색어를 입력해주세요.");
                  return focus();
                }
                console.log("검색 ㄱㄱ");
              }
            }}
            className={twMerge(
              "flex-1 w-full outline-none px-2.5",
              Keyword.focused && "text-theme"
            )}
            containerClassName="flex-1"
            contentClassName="h-15"
          />
        </div>
      </header>

      <main>{children}</main>

      <nav className="border border-gray-200 fixed bottom-0 left-0 w-full bg-white z-10">
        <ul className="flex-row gap-0 ">
          {menus.map((menu) => {
            const selected = pathname === menu.href;
            console.log(pathname);
            return (
              <li key={menu.href} className="flex-1">
                <Link
                  href={menu.href}
                  className={twMerge(
                    "flex-col h-15 flex-1 text-xs text-gray-500",
                    selected && "text-theme"
                  )}
                  onClick={() => {
                    if (menu.name === "검색" || menu.href.length === 0) {
                      Keyword.focus();
                    }
                  }}
                >
                  <menu.Icon className="text-2xl" />
                  {menu.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default CustomLayout;
