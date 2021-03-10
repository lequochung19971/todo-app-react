import React, { lazy, ReactElement } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Navigations from './Navigations';
import NotFound404 from './NotFound404';
import PrivateRoute from './PrivateRoute';

const Todo = lazy(() => import('../../features/Todo'));

function Shell(): ReactElement {
  return (
    <>
      <Navigations />
      <Switch>
        <Redirect exact from="/" to="/todo" />
        <PrivateRoute path="/todo" component={Todo} />
        <Route path="*" component={NotFound404} />
      </Switch>
    </>
  );
}

export default Shell;
