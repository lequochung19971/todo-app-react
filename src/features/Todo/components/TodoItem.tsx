import { Button, Checkbox, List } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import Modal from 'antd/lib/modal/Modal';
import React, { ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Status } from '../../../shared/interfaces-enum/Status.enum';
import { Todo } from '../../../shared/interfaces-enum/Todo.interface';
import { removeTodo, updateTodoStatus } from '../todosSlice';

type TodoItemProps = {
  item: Todo;
};

function TodoItem(props: TodoItemProps): ReactElement {
  const { item } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const hasCompleted = item.status === Status.COMPLETE;
  const hasActived = item.status === Status.ACTIVE;

  const markComplete = (item: Todo) => {
    dispatch(updateTodoStatus({todo: item, status: Status.COMPLETE}))
  };

  const onCheck = (event: CheckboxChangeEvent, item: Todo) => {
    const status = event.target.checked ? Status.ACTIVE : Status.ALL;
    dispatch(updateTodoStatus({todo: item, status}));
  };

  const handleConfirm = async () => {
    try {
      await dispatch(removeTodo(item.id));
    } catch (error) {
      setIsModalVisible(false);
      throw error;
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  }

  const buttonActions = [
    <Button key="btn-complete" disabled={hasCompleted} type="primary" size="small" onClick={() => markComplete(item)}>
      Complete
    </Button>,
    <Button key="btn-remove" size="small" onClick={()=> setIsModalVisible(true)} danger>Remove</Button>,
    <Button key="btn-remove" size="small" onClick={()=> history.push(`/todo/${item.id}`)}>Detail</Button>
  ];

  return (
    <>
      <List.Item actions={buttonActions} >
        <Checkbox disabled={hasCompleted} checked={hasActived} onChange={(event) => onCheck(event, item)}>
          <span className={hasCompleted ? 'line-through' : ''}>
            {item.value}
          </span>
        </Checkbox>
      </List.Item>
      <Modal title="Are you sure ?" visible={isModalVisible} onOk={handleConfirm} onCancel={handleCancel}>
        <p>Do you really want to delete this item? </p>
      </Modal>
    </>
  );
}

export default TodoItem;
