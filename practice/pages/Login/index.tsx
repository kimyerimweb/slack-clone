import React, { useCallback, useState } from 'react';

import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSWR from 'swr';

import useInput from '@hooks/useInput';
import fetcher from '@utils/fetcher';

const url = 'http://localhost:3095';

const Login = () => {
  const { data, error, revalidate } = useSWR(`${url}/api/users`, fetcher); //옵션 달아주기
  const [email, setEmail, onChangeEmail] = useInput('');
  const [password, setPassword, onChangePassword] = useInput('');
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmitForm = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      axios
        .post(
          'http://localhost:3095/api/users/login',
          { email, password },
          { withCredentials: true },
        )
        .then(() => {
          revalidate();
        })
        .catch((error) => {
          toast.error(error.response.data, {
            position: 'bottom-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setErrorMessage(error.response.data);
        });
    },
    [email, password],
  );

  if (data) {
    return <Redirect to="/workspace" />;
  }

  return (
    <>
      <h1>Sleact</h1>

      <form onSubmit={onSubmitForm}>
        <label htmlFor="email">이메일 주소</label>
        <input
          value={email}
          onChange={onChangeEmail}
          type="email"
          name="email"
          id="email"
          required
        />

        <label htmlFor="password">비밀번호</label>
        <input
          value={password}
          onChange={onChangePassword}
          type="password"
          name="password"
          id="password"
          required
        />

        <div>{errorMessage}</div>
        <button type="submit">로그인</button>
      </form>

      <p>아직 회원이 아니신가요?</p>
      <Link to="/signup">회원가입 하러가기</Link>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Login;
