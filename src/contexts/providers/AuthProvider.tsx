"use client";

import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { AUTH } from "../react.context";
import { authService, dbService, FBCollection } from "@/lib";
import { GiStrawberry } from "react-icons/gi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState(AUTH.initialState.user);
  const [isPending, startTransition] = useTransition();

  const ref = useMemo(() => dbService.collection(FBCollection.USERS), []);

  const { data, error } = useQuery({
    queryKey: ["user", user?.uid],
    queryFn: async (): Promise<null | User> => {
      if (!user) {
        return null;
      }
      const snap = await ref.doc(user.uid).get();
      const data = snap.data() as User | null;
      return data;
    },
  });

  //! re-validate -> invalidation
  const queryClient = useQueryClient();

  //! user 다시 받아오기
  const caching = useCallback(() => {
    const queryKey = ["user", user?.uid];
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, user]);

  useEffect(() => {
    if (error) {
      console.log(error);
    } else {
      if (data) {
        // console.log(data);

        setUser(data);
      }
    }
  }, [data, error]);

  const signin = useCallback(
    (email: string, password: string) =>
      new Promise<Result>((resolve) =>
        startTransition(async () => {
          try {
            const { user } = await authService.signInWithEmailAndPassword(
              email,
              password
            );
            if (!user) {
              return resolve({
                success: false,
                message: "알 수 없는 이유로 데이터를 가져오는데 실패했습니다.",
              });
            }
            const snap = await ref.doc(user.uid).get();
            const data = snap.data() as User;
            if (!data) {
              return resolve({
                message:
                  "존재하지 않는 유저입니다. 다시 한 번 회원가입 해주세요.",
              });
            }

            setUser(data); //! 데이터베이스에서 가져온 유저

            resolve({ success: true });
          } catch (error: any) {
            resolve({ message: error.message });
          }
        })
      ),
    [ref]
  );

  const signout = useCallback(
    () =>
      new Promise<Result>((resolve) =>
        startTransition(async () => {
          try {
            await authService.signOut(); //! firebase user 로그아웃
            setUser(null); //! React 유저 로그아웃
            return resolve({ success: true });
          } catch (error: any) {
            return resolve({ message: error.message });
          }
        })
      ),
    []
  );

  const signup = useCallback(
    (newUser: User & { password: string }) =>
      new Promise<Result>((resolve) =>
        startTransition(async () => {
          try {
            //! 인증 => 회원가입
            const { user } = await authService.createUserWithEmailAndPassword(
              newUser.email,
              newUser.password
            );
            if (!user) {
              return resolve({ message: "회원가입에 실패했습니다." });
            }

            //! 회원가입 정보를 데이터베이스 저장
            //@ts-ignore
            delete newUser.password;
            const storedUser: User = { ...newUser, uid: user.uid };

            //@ts-ignore
            delete storedUser.password;
            await ref.doc(user.uid).set(storedUser);

            return resolve({ success: true });
          } catch (error: any) {
            return resolve({ message: error.message });
          }
        })
      ),
    []
  );

  const updateAll = useCallback(
    (updatedUser: User) =>
      new Promise<Result>((resolve) =>
        startTransition(async () => {
          try {
            //! 유저의 모든 내용을 업데이트 시킴 => set/update
            await ref.doc(updatedUser.uid).set(updatedUser);
            await ref.doc(updatedUser.uid).update(updatedUser);
            return resolve({ success: true });
          } catch (error: any) {
            return resolve({ message: error.message });
          }
        })
      ),
    [ref]
  );

  const updateOne = useCallback(
    (target: keyof User, value: any) =>
      new Promise<Result>((resolve) =>
        startTransition(async () => {
          try {
            if (!user) {
              return resolve({
                message:
                  "로그인 한 유저만 사용할 수 잇는 기능입니다. 로그인 하시겠습니까?",
              });
            }

            //! firebase에 데이터 저장하는 로직
            await ref.doc(user.uid).update({ [target]: value });

            //? client의 user 업데이트 // =>firebase 실시간 리스너 || react-query || setUser로 업데이트
            // setUser({ ...user, [target]: value }); //제일 간단한 방법
            caching();

            return resolve({ success: true });
          } catch (error: any) {
            return resolve({ message: error.message });
          }
        })
      ),
    [ref, user, caching]
  );

  //! 실시간 리스너 안좋은점 : 실시간으로 계속 요청 날림

  useEffect(() => {
    const subscribeUser = authService.onAuthStateChanged(async (fbUser) => {
      if (!fbUser) {
        console.log("not logged in");
      } else {
        const { uid } = fbUser;
        const snap = await ref.doc(uid).get();
        const data = snap.data() as User;
        if (!data) {
          console.log("no user data");
        } else {
          console.log(data);
          setUser(data ?? null);
        }
      }

      setTimeout(() => {
        setInitialized(true);
      }, 1000);
    });

    return subscribeUser;
  }, []);

  return (
    <AUTH.Context.Provider
      value={{
        initialized,
        isPending,
        signin,
        signout,
        signup,
        updateAll,
        updateOne,
        user,
      }}
    >
      {!initialized ? (
        <div className="modal con justify-center items-center text-theme bg-white">
          <GiStrawberry className="text-6xl" />
          <h1 className="text-2xl font-black">딸기마켓</h1>
        </div>
      ) : (
        children
      )}
    </AUTH.Context.Provider>
  );
};

export default AuthProvider;
