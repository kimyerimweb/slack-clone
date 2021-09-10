import React, { useCallback, useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useInput from '@hooks/useInput';

const Signup = () => {
  const [passwordValidation, setPasswordValidation] = useState(false);
  const [registration, setRegistration] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [email, setEmail, onChangeEmail] = useInput('');
  const [nickname, setNickname, onChangeNickname] = useInput('');

  const [password, setPassword] = useState('');
  const onChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);

    if (e.target.value === passwordCheck) {
      setPasswordValidation(true);
    } else {
      setPasswordValidation(false);
    }
  }, []);

  const [passwordCheck, setPasswordCheck] = useState('');
  const onChangePasswordCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordCheck(e.target.value);

      if (e.target.value === password) {
        setPasswordValidation(true);
      } else {
        setPasswordValidation(false);
      }
    },
    [password],
  );

  const onSubmitForm = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (email.trim() && nickname.trim() && password.trim() && passwordCheck.trim()) {
        axios
          .post('http://localhost:3095/api/users', {
            email,
            nickname,
            password,
          })
          .then(() => {
            setRegistration(true);
            setEmail('');
            setNickname('');
            setPassword('');
            setPasswordCheck('');
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
      }
    },
    [email, nickname, password, passwordCheck],
  );

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

        <label htmlFor="nickname">닉네임</label>
        <input
          value={nickname}
          onChange={onChangeNickname}
          type="text"
          name="nickname"
          id="nickname"
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

        <label htmlFor="passwordCheck">비밀번호 확인</label>
        <input
          value={passwordCheck}
          onChange={onChangePasswordCheck}
          type="password"
          name="passwordCheck"
          id="passwordCheck"
          required
        />

        {password && passwordCheck && !passwordValidation && (
          <div>비밀번호가 일치하지 않습니다.</div>
        )}
        {registration && <div>회원가입 성공</div>}
        <div>{errorMessage}</div>

        <button type="submit">회원가입</button>
      </form>

      <p>이미 회원이신가요?</p>
      <Link to="/login">로그인 하러가기</Link>

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

export default Signup;
