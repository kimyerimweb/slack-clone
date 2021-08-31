import React, { useCallback, useState } from 'react';
import useSWR from 'swr';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import useInput from '@hooks/useInput';
import { Button, Error, Form, Header, Input, Label, LinkContainer } from '@pages/SignUp/styles';
import fetcher from '@utils/fetcher';

const LogIn = () => {
  const { data, error, revalidate, mutate } = useSWR('http://localhost:3095/api/users', fetcher, {
    dedupingInterval: 100000,
  });
  const [email, onChangeEmail, setEmail] = useInput('');
  const [password, onChangePassword, setPassword] = useInput('');
  const [loginError, setLoginError] = useState(false);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLoginError(false);
      axios
        .post(
          'http://localhost:3095/api/users/login',
          {
            email,
            password,
          },
          { withCredentials: true },
        )
        .then((response) => {
          revalidate();
        })
        .catch((error) => {
          setLoginError(error.response?.data?.statusCode === 401);
        });
    },
    [email, password],
  );

  if (data) {
    return <Redirect to="/workspace/channel" />;
  }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" value={email} onChange={onChangeEmail} required />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" value={password} onChange={onChangePassword} required />
          </div>
          {loginError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다!</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;
