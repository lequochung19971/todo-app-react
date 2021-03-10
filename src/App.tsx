import React, { lazy, ReactElement, Suspense } from 'react';
import './App.scss';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NotFound404 from './shared/components/NotFound404';
import { Provider } from 'react-redux';
import store from './app/store';
import Shell from './shared/components/Shell';

const Login = lazy(() => import('./features/Login'));

function App(): ReactElement {
  return (
    <Suspense fallback={<div>Loading ...</div>}>
      <BrowserRouter>
        <Provider store={store}>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/" component={Shell} />
            <Route path="*" component={NotFound404} />
          </Switch>
        </Provider>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
