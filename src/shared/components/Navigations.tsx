import { FileProtectOutlined, LogoutOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React, { ReactElement, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { doLogout, selectAccessToken } from '../../features/Login/loginSlice';
import { sagaLogout } from '../../features/Todo/sagas';

function Navigations(): ReactElement {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const accessToken = useAppSelector(selectAccessToken);

  useEffect(() => {
    if (!accessToken) {
      history.push('/login');
    }
  }, [accessToken])
  
  const logout = () => {
    dispatch(sagaLogout())
    // dispatch(doLogout());
  }

  return (
    <Menu mode="horizontal" theme="dark">
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
        Log out
      </Menu.Item>
      <Menu.Item key="todo" icon={<FileProtectOutlined />}>
        <Link to="/todo">Todos</Link>
      </Menu.Item>
    </Menu>
  );
}

export default Navigations;
