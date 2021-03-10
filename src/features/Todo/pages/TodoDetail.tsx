import { Tag } from 'antd';
import React, { ReactElement } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { Status } from '../../../shared/interfaces-enum/Status.enum';
import { selectTodoById } from '../todosSlice';

function TodoDetail(): ReactElement {
  const { params } = useRouteMatch<any>();
  const currentTodo = useAppSelector((state) => selectTodoById(state, params.id))

  const getStatus = () => {
    if (currentTodo?.status === Status.ACTIVE) {
      return <Tag color="blue">{Status.ACTIVE}</Tag>
    }

    if (currentTodo?.status === Status.COMPLETE) {
      return <Tag color="green">{Status.COMPLETE}</Tag>
    }

    return <Tag color="grey">NEW</Tag>
  }

  return (
    <div className="p-15px">
      <h2>Title: {currentTodo?.value}</h2>
      <p><strong>Created Date: </strong>{currentTodo?.createdDate}</p>
      <div><strong>Status: </strong>{getStatus()}</div>
    </div>
  );
}

export default TodoDetail;