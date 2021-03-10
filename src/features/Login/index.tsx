import React, { ReactElement } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import NotFound404 from '../../shared/components/NotFound404';
import LoginPage from './pages/LoginPage';

function Login(): ReactElement {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route exact path={match.url} component={LoginPage} />
      <Route path='*' component={NotFound404}/>
    </Switch>
  );
}

export default Login;