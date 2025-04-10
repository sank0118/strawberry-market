"use client";
import { Form, SubmitButton, TextInput, useModal } from "@/components";
import { AUTH } from "@/contexts";
import { isNum } from "@/utils";
import { useCallback, useMemo, useState } from "react";

const MyComponent = () => {
  const { user, onUpdate, isPending } = AUTH.use();

  const Seller = useModal();
  const [id, setId] = useState("");
  const message = useMemo(() => {
    if (id.length === 0) {
      return "사업자 등록번호를 입력하세요.";
    }
    if (!isNum(id)) {
      return "숫자만 입력해주세요.";
    }
    return null;
  }, [id]);

  const onSubmit = useCallback(async () => {
    if (message) {
      return alert(message);
    }
    const { success, message: msg } = await onUpdate("sellerId", id);
    if (!success || msg) {
      return alert(msg);
    }

    Seller.hide();
    return alert("판매자 계정으로 전환합니다.");
  }, [message, id, onUpdate, Seller.hide]);

  if (!user) {
    return null;
  }

  return (
    <div>
      {user.sellerId ? (
        <div className="flex flex-col gap-y-5 p-5">
          <h1>판매자 계정이 아닙니다. 사업자등록번호를 등록해주세요.</h1>
          <SubmitButton className="px-2.5" onClick={Seller.open}>
            사업자 등록번호 입력
          </SubmitButton>

          <Seller.Modal className="p-5">
            {isPending}
            <Form>
              <TextInput
                value={id}
                onChange={(e) => setId(e.target.value)}
                label="사업자 등록 번호"
                name="sellerId"
                placeholder="000-00000-000"
                message={message}
              />
              <SubmitButton className="mt-2.5">
                사업자 등록번호 저장
              </SubmitButton>
            </Form>
          </Seller.Modal>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MyComponent;
