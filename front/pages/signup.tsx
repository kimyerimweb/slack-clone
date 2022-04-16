import { useForm } from "react-hook-form";
import Link from "next/link";
import { useCallback, useRef, useEffect, useState } from "react";
import axios from "axios";

type Formvalues = {
  email: string;
  nickname: string;
  password: string;
  passwordCheck: string;
};

export default function Signup() {
  const [isSignUpSuccess, setIsSignUpSuccess] = useState<boolean>(false);
  const [isSignUpError, setIsSignUpError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<Formvalues>({
    defaultValues: {
      email: "",
      nickname: "",
      password: "",
      passwordCheck: "",
    },
  });

  const password = useRef<string>();
  password.current = watch("password");

  useEffect(() => {
    if (isSignUpSuccess) {
      reset({
        email: "",
        nickname: "",
        password: "",
        passwordCheck: "",
      });
    }
  }, [isSignUpSuccess, reset]); //회원가입 정보를 보냈고 성공했을 때 변경되는 값을 이용하기

  const handleSubmitForm = useCallback((data) => {
    const { email, nickname, password } = data;

    setIsSignUpSuccess(false);
    setIsSignUpError("");

    axios
      .post("http://localhost:3095/api/users", {
        email,
        nickname,
        password,
      })
      .then(() => {
        setIsSignUpSuccess(true);
      })
      .catch((error) => {
        setIsSignUpSuccess(false);
        setIsSignUpError(error.response.data);
      });
  }, []);

  return (
    <>
      <header>
        <h1 aria-label="logo">logo</h1>
        Sleact
      </header>
      <main>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <input
            {...register("email", {
              required: "필수 응답 항목입니다.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
                message: "이메일 형식이 아닙니다.",
              },
            })}
            placeholder="name@work-email.com"
          />
          <p>{errors.email && errors.email.message}</p>
          <input
            {...register("nickname", {
              required: "필수 응답 항목입니다.",
              minLength: {
                value: 2,
                message: "닉네임은 2자 이상입니다.",
              },
              validate: (value) => value.trim() !== "",
            })}
            type="text"
            placeholder="nickname (2자 이상)"
          />
          <p>{errors.nickname && errors.nickname.message}</p>
          {errors.nickname && errors.nickname.type === "validate" && (
            <p>유효하지 않은 닉네임입니다. (공백으로 이루어져 있습니다.)</p>
          )}
          <input
            {...register("password", {
              required: true,
              minLength: {
                value: 8,
                message: "비밀번호는 최소 8자 이상입니다.",
              },
            })}
            type="password"
            placeholder="password (8자 이상)"
          />
          <p>{errors.password && errors.password.message}</p>
          <input
            {...register("passwordCheck", {
              required: true,
              minLength: {
                value: 8,
                message: "비밀번호는 최소 8자 이상입니다.",
              },
              validate: (value) => value === password.current,
            })}
            type="password"
            placeholder="password Check"
          />
          <p>{errors.passwordCheck && errors.passwordCheck.message}</p>
          {errors.passwordCheck && errors.passwordCheck.type === "validate" && (
            <p>비밀번호가 일치하지 않습니다</p>
          )}
          <button type="submit">회원가입</button>
          {isSignUpError && <p>{isSignUpError}</p>}
          {isSignUpSuccess && (
            <p>회원가입에 성공했습니다! 로그인을 해주세요!</p>
          )}
        </form>
        <p>
          이미 회원이신가요?
          <Link href="/login">로그인 하러가기</Link>
        </p>
      </main>
    </>
  );
}
