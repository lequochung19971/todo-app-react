import { Menu } from 'antd';
import React, { ReactElement, ReactText } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../app/hooks';
import { Status } from '../../../shared/interfaces-enum/Status.enum';
import { selectStatusBar, setStatusBar } from '../todosSlice';

function StatusBar(): ReactElement {
  const status = useAppSelector(selectStatusBar);
  const dispatch = useDispatch();

  const handleClick = (currentStatus: ReactText) => {
    dispatch(setStatusBar(currentStatus as Status));
  }

  return (
    <>
      <Menu mode="horizontal" selectedKeys={[status]} onClick={({ key }) => handleClick(key)} >
        <Menu.Item key={Status.ALL}>All</Menu.Item>
        <Menu.Item key={Status.ACTIVE}>Active</Menu.Item>
        <Menu.Item key={Status.COMPLETE}>Complete</Menu.Item>
      </Menu>
    </>
  );
}

export default StatusBar