"use client";

import { Form, useTextInput } from "@/components";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

const Signin = () => {
  const [loginProps, setLoginProps] = useState({
    email: "test@test.com",
    password: "123123",
  });
  const Email = useTextInput();
  const Password = useTextInput();
  const onChangeL = useCallback(
    (value: string, event: ChangeEvent<HTMLInputElement>) => {
      setLoginProps((prev) => ({ ...prev, [event.target.name]: value }));
    },
    []
  );

  const onSubmit = useCallback(() => {}, []);

  useEffect(() => {
    console.log(loginProps);
  }, [loginProps]);

  return (
    <Form
      Submit={<button className="primary flex-1">로그인</button>}
      onSubmit={onSubmit}
    >
      <Email.TextInput
        value={loginProps.email}
        onChangeText={onChangeL}
        name="email"
      />
      <Password.TextInput
        value={loginProps.password}
        onChangeText={onChangeL}
        name="password"
      />
    </Form>
  );
};

export default Signin;
