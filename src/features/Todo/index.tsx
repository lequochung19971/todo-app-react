import React, { ReactElement } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import NotFound404 from '../../shared/components/NotFound404';
import TodoDetail from './pages/TodoDetail';
import TodoPage from './pages/TodoPage';

function Todo(): ReactElement {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route exact path={match.url} component={TodoPage} />
      <Route exact path={`${match.url}/:id`} component={TodoDetail} />
      <Route path='*' component={NotFound404}/>
    </Switch>
  );
}

export default Todo;