"use client";

import { AUTH } from "@/contexts";
import SellerIdForm from "./SellerIdForm";
import { useQuery } from "@tanstack/react-query";
import { dbService, FBCollection } from "@/lib";
import { Loading } from "@/components";
import MyProducts from "./MyProducts";

const MyPage = () => {
  const { user } = AUTH.use();

  const queryKey = ["my-products", user?.uid, user?.sellerId];
  const { isPending, error, data } = useQuery({
    queryKey,
    queryFn: async () => {
      const ref = dbService.collection(FBCollection.PRODUCTS);
      const snap = await ref.where("sellerId", "==", user?.sellerId).get();
      const data = snap.docs.map(
        (doc) => ({ ...doc.data(), id: doc.id } as Product)
      );

      return data ?? [];
    },
  });

  if (!user?.sellerId) {
    return <SellerIdForm />;
  }

  //! user.sellerId 가 있어야 상품 보여줄 거임
  if (isPending) {
    //! react query 아직 가져오는 중 // caching이 이루어져서 새로운 데이터를 가져올 때에도 사용됨
    return <Loading message="데이터 가져오는 중..." />;
  }
  if (error || !data) {
    //! react query에서 어떠한 연유로 문제가 발생
    return (
      <div>
        <h1>Error: {error.message ?? "문제 발생"}</h1>
      </div>
    );
  }
  return <MyProducts queryKey={queryKey} data={data} />;
};

export default MyPage;
