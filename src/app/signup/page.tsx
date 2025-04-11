"use client";

import { Form, Loading, useTextInput } from "@/components";
import {
  emailValidator,
  korValidator,
  mobileValidator,
  passwordValidator,
} from "@/utils";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import JusoComponent, { JusoRef } from "./JusoComponent";
import { AUTH } from "@/contexts";
import { useNavi } from "@/hooks";

// SSR 나중에 해보기

// type SignupProps = User & { password: string };
interface SignupProps extends User {
  password: string;
}

const Signup = () => {
  const [signupProps, setSignupPros] = useState<SignupProps>({
    createdAt: new Date(),
    email: "test@test.com",
    name: "김딸기",
    password: "123123",
    sellerId: null,
    uid: "",
    jusoes: [],
    mobile: "01012341234",
  });

  const { email, name, password, jusoes, mobile } = signupProps;

  const [confirmPassword, setConfirmPassword] = useState("123123");

  const Email = useTextInput();
  const Password = useTextInput();
  const ConfirmPassword = useTextInput();
  const Name = useTextInput();
  const Mobile = useTextInput();

  const jusoRef = useRef<JusoRef>(null);

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

  const { user, signup, isPending } = AUTH.use();

  const navi = useNavi();

  const onSubmit = useCallback(async () => {
    if (nameMessage) {
      alert(nameMessage);
      return Name.focus();
    }

    if (mobileMessage) {
      alert(mobileMessage);
      return Mobile.focus();
    }

    if (emailMessage) {
      alert(emailMessage);
      return Email.focus();
    }

    if (passwordMessage) {
      alert(passwordMessage);
      return Password.focus();
    }

    if (confirmPasswordMessage) {
      alert(confirmPasswordMessage);
      return ConfirmPassword.focus();
    }

    if (jusoes.length === 0) {
      alert("기본 배송지를 입력해주세요.");
      jusoRef.current?.openModal();
      jusoRef.current?.focusKeyword();
      return;
    }

    const { success, message } = await signup(signupProps);
    if (!success || message) {
      return alert(message ?? "회원가입 시 문제가 발생했습니다.");
    }

    alert("회원가입을 축하합니다.");
  }, [
    nameMessage,
    mobileMessage,
    passwordMessage,
    confirmPasswordMessage,
    emailMessage,
    jusoes,
    signup,
    signupProps,
    jusoRef,
  ]);

  useEffect(() => {
    console.log(signupProps, user);
  }, [signupProps, user]);

  return (
    <div className="">
      {isPending && <Loading />}
      <Form
        onSubmit={onSubmit}
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
        ref={jusoRef}
      />
    </div>
  );
};

export default Signup;
