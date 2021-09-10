import React from 'react';
import loadable from '@loadable/component';
import { Redirect, Route, Switch } from 'react-router';

const Login = loadable(() => import('@pages/Login'));
const Signup = loadable(() => import('@pages/Signup'));
const Workspace = loadable(() => import('@layouts/Workspace'));

const App = () => {
  return (
    <Switch>
      <Redirect exact from="/" to="/login" />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/workspace" component={Workspace} />
    </Switch>
  );
};

export default App;
