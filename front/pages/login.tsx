import { useForm } from "react-hook-form";
import Router from "next/router";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import useSWR from "swr";
import fetcher from "../utils/fetcher";

type Formvalues = {
  email: string;
  password: string;
};

export default function Login() {
  const [isLoginError, setIsLoginError] = useState("");
  const { data: userData } = useSWR("http://localhost:3095/api/users", fetcher);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Formvalues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmitForm = useCallback((data) => {
    const { email, password } = data;
    axios
      .post(
        "http://localhost:3095/api/users/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      )
      .then(() => {
        Router.replace("/");
      })
      .catch((error) => {
        setIsLoginError(error.response.data);
      });
  }, []);

  useEffect(() => {
    if (userData) {
      Router.replace("/");
    }
  }, [userData]);

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
          <button type="submit">로그인</button>
          {isLoginError && <p>{isLoginError}</p>}
        </form>
        <p>
          회원이 아니신가요?
          <Link href="/signup">회원가입 하러가기</Link>
        </p>
      </main>
    </>
  );
}
