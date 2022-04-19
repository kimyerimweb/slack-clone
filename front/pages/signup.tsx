import styles from "../styles/auth.module.scss";
import { useForm } from "react-hook-form";
import Router from "next/router";
import Link from "next/link";
import { useCallback, useRef, useEffect, useState } from "react";
import axios from "axios";
import useSWR from "swr";
import fetcher from "../utils/fetcher";

type Formvalues = {
  email: string;
  nickname: string;
  password: string;
  passwordCheck: string;
};

export default function Signup() {
  const [isSignUpSuccess, setIsSignUpSuccess] = useState<boolean>(false);
  const [isSignUpError, setIsSignUpError] = useState<string>("");

  const { data } = useSWR("http://localhost:3095/api/users", fetcher);

  useEffect(() => {
    if (data) {
      Router.replace("/");
    }
  }, [data]);

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
      .post(
        "http://localhost:3095/api/users",
        {
          email,
          nickname,
          password,
        },
        { withCredentials: true }
      )
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
      <header className={styles.header}>Sleact</header>
      <main>
        <form onSubmit={handleSubmit(handleSubmitForm)} className={styles.form}>
          <input
            className={styles.input}
            {...register("email", {
              required: "필수 응답 항목입니다.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
                message: "이메일 형식이 아닙니다.",
              },
            })}
            placeholder="name@work-email.com"
          />
          <p className={styles.error}>{errors.email && errors.email.message}</p>
          <input
            className={styles.input}
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
          <p className={styles.error}>
            {errors.nickname && errors.nickname.message}
          </p>
          {errors.nickname && errors.nickname.type === "validate" && (
            <p className={styles.error}>
              유효하지 않은 닉네임입니다. (공백으로 이루어져 있습니다.)
            </p>
          )}
          <input
            className={styles.input}
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
          <p className={styles.error}>
            {errors.password && errors.password.message}
          </p>
          <input
            className={styles.input}
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
          <p className={styles.error}>
            {errors.passwordCheck && errors.passwordCheck.message}
          </p>
          {errors.passwordCheck && errors.passwordCheck.type === "validate" && (
            <p className={styles.error}>비밀번호가 일치하지 않습니다</p>
          )}
          <button className={styles.button} type="submit">
            회원가입
          </button>
          {isSignUpError && <p>{isSignUpError}</p>}
          {isSignUpSuccess && (
            <p className={styles.success}>
              회원가입에 성공했습니다! 로그인을 해주세요!
            </p>
          )}
        </form>
        <p className={styles.linkContainer}>
          이미 회원이신가요?
          <Link href="/login">로그인 하러가기</Link>
        </p>
      </main>
    </>
  );
}
