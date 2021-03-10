import { Button, List } from 'antd';
import React, { ReactElement, useEffect } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../app/hooks';
import { sagaFetchTodos, sagaFetchTodosTimeout } from '../sagas';
import { fetchTodos, selectTodosBasedOnStatusBard, selectLoading } from '../todosSlice';
import TodoItem from './TodoItem';

function TodoList(): ReactElement {
  const todos = useAppSelector(selectTodosBasedOnStatusBard, shallowEqual);
  const loading = useAppSelector(selectLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTodos());
    dispatch(sagaFetchTodos());
  }, [dispatch]);

  const onRefresh = () => {
    dispatch(sagaFetchTodosTimeout());
  }

  const buttonRefresh = (
    <Button onClick={onRefresh}>Refresh</Button>
  )
  
  return (
    <List 
      header={buttonRefresh}
      bordered
      loading={loading}
      dataSource={todos} 
      renderItem={(item) => <TodoItem item={item} /> }
      pagination={{
        onChange(data) {
          console.log(data)
        },
        pageSize: 5,
        defaultPageSize: 10
      }}
    />
  );
}

export default TodoList;
