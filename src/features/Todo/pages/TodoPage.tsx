import { Divider } from 'antd';
import React, { ReactElement } from 'react';
import AddingForm from '../components/AddingForm';
import StatusBar from '../components/StatusBar';
import TodoList from '../components/TodoList';

function TodoPage(): ReactElement {
  return (
    <div className="w-500px h100 p-15px">
      <AddingForm />
      <Divider plain orientation="left">
        Todos
      </Divider>
      <StatusBar />
      <TodoList />
    </div>
  );
}

export default TodoPage;
