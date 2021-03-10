import React, { ReactElement } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { getAccessToken } from '../localStorage/localStoreage';

function PrivateRoute({ component, ...rest }: RouteProps): ReactElement {
  const isLoggedIn = !!getAccessToken();

  return <>{isLoggedIn ? <Route {...rest} component={component} /> : <Redirect to="/login" />}</>;
}

export default PrivateRoute;
