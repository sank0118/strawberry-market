import { useModal } from "@/components";
import MyProductForm from "./MyProductForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dbService, FBCollection } from "@/lib";

interface Props {
  queryKey: any[];
  data: Product[];
}
const MyProducts = ({ data, queryKey }: Props) => {
  const ADDPRODUCT = useModal();
  const queryClient = useQueryClient();

  //! CUD
  const mutation = useMutation({
    mutationFn: async ({
      action,
      product,
    }: {
      action: "CREATE" | "UPDATE" | "DELETE";
      product: Product;
    }) => {
      try {
        const ref = dbService.collection(FBCollection.PRODUCTS);
        switch (action) {
          case "CREATE":
            return await ref.add(product);

          case "UPDATE":
            return await ref.doc(product.id).update(product);

          case "DELETE":
            return await ref.doc(product.id).delete();
        }
      } catch (error: any) {
        throw new Error(error.message);
      }
    },

    //! side Effect
    // error handling
    onError: (err) => console.log(err.message),

    //success handling
    onSuccess: () => {
      console.log("success");
      //! caching 되어 있는 데이터를 다시 받아오게 만들기
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return (
    <>
      {data.length === 0 ? (
        <div className="flex-1 justify-center items-center">
          <button className="border" onClick={ADDPRODUCT.open}>
            등록된 상품이 없습니다. 추가해주세요.
          </button>
          <ADDPRODUCT.Modal state={ADDPRODUCT.state}>
            <MyProductForm
              onSubmit={(item) =>
                mutation.mutate({ action: "CREATE", product: item })
              }
            />
          </ADDPRODUCT.Modal>
        </div>
      ) : (
        <ul>
          {data.map((product) => (
            <li key={product.id}>{product.name}</li>
          ))}
        </ul>
      )}
    </>
  );
};

export default MyProducts;
