import React from 'react';
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router';
import { Link } from 'react-router-dom';

//const Login = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/SignUp'));

const App = () => {
  return (
    <>
      <Link to="/login">로그인 페이지</Link>
      <Link to="/signup">회원가입 페이지</Link>
      <Switch>
        <Redirect exact path="/" to="/login" />
        {/* <Route path="/login" component={Login} /> */}
        <Route path="/signup" component={SignUp} />
      </Switch>
    </>
  );
};

export default App;
