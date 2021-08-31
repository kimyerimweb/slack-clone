import React from 'react';
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router';
import { Link } from 'react-router-dom';

const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Channel = loadable(() => import('@pages/Channel'));

const App = () => {
  return (
    <>
      <Link to="/login">로그인 페이지</Link>
      <Link to="/signup">회원가입 페이지</Link>
      <Switch>
        <Redirect exact path="/" to="/login" />
        <Route path="/login" component={LogIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/workspace/channel" component={Channel} />
      </Switch>
    </>
  );
};

export default App;
