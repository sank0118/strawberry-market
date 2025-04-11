"use client";

import { Form, useTextInput } from "@/components";
import {
  emailValidator,
  korValidator,
  mobileValidator,
  passwordValidator,
} from "@/utils";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import JusoComponent from "./JusoComponent";

// SSR 나중에 해보기

// type SignupProps = User & { password: string };
interface SignupProps extends User {
  password: string;
}

const Signup = () => {
  const [signupProps, setSignupPros] = useState<SignupProps>({
    createdAt: new Date(),
    email: "test@test.com",
    name: "",
    password: "",
    sellerId: null,
    uid: "",
    jusoes: [],
    mobile: "010",
  });

  const { email, name, password, jusoes, mobile } = signupProps;

  const [confirmPassword, setConfirmPassword] = useState("");

  const Email = useTextInput();
  const Password = useTextInput();
  const ConfirmPassword = useTextInput();
  const Name = useTextInput();
  const Mobile = useTextInput();

  const onChangeS = useCallback(
    (value: string, event: ChangeEvent<HTMLInputElement>) => {
      setSignupPros((prev) => ({ ...prev, [event.target.name]: value }));
    },
    []
  );

  const nameMessage = useMemo(() => korValidator(name), [name]);
  const mobileMessage = useMemo(() => mobileValidator(mobile), [mobile]);

  const emailMessage = useMemo(() => emailValidator(email), [email]);

  const passwordMessage = useMemo(
    () => passwordValidator(password),
    [password]
  );

  const confirmPasswordMessage = useMemo(() => {
    if (passwordValidator(confirmPassword)) {
      return passwordValidator(confirmPassword);
    }
    if (password !== confirmPassword) {
      return "비밀번호가 일치하지 않습니다.";
    }
    return null;
  }, [password, confirmPassword]);

  return (
    <div>
      <Form
        className="border w-full p-5"
        Submit={<button className="primary flex-1">회원가입</button>}
      >
        <Name.TextInput
          value={name}
          onChangeText={onChangeS}
          label="이름"
          placeholder="KS"
          name="name"
          message={nameMessage}
        />

        <Mobile.TextInput
          value={mobile}
          onChangeText={onChangeS}
          label="휴대전화"
          placeholder="01012341234"
          name="mobile"
          message={mobileMessage}
        />

        <Email.TextInput
          value={email}
          onChangeText={onChangeS}
          label="이메일"
          placeholder="your@email.com"
          name="email"
          message={emailMessage}
        />

        <Password.TextInput
          value={password}
          onChangeText={onChangeS}
          label="비밀번호"
          placeholder="6~18자리"
          name="password"
          type="password"
          message={passwordMessage}
        />

        <ConfirmPassword.TextInput
          value={password}
          onChangeText={onChangeS}
          label="비밀번호 확인"
          placeholder="********"
          type="password"
          message={confirmPasswordMessage}
        />
      </Form>

      <JusoComponent
        jusoes={jusoes}
        onChangeJ={(j) => setSignupPros((prev) => ({ ...prev, jusoes: j }))}
      />
    </div>
  );
};

export default Signup;
