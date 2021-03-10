import { unwrapResult } from '@reduxjs/toolkit';
import { Button, Input } from 'antd';
import React, { ChangeEvent, FormEvent, ReactElement, useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { LoginParams } from '../../../api/loginApi';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { sagaLogin } from '../../Todo/sagas';
import { login, selectAccessToken } from '../loginSlice';

function LoginPage(): ReactElement {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const accessToken = useAppSelector(selectAccessToken);
  const dispatch = useAppDispatch();

  const emailChange = (event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
  const passwordChange = (event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);

  useEffect(() => {
    if (!!accessToken) {
      history.push('/todo');
    } else {
      history.push('/login');
    }
  }, [accessToken])
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data: LoginParams = {
      email,
      password
    };

    dispatch(sagaLogin(data));
    // try {
    //   const action = await dispatch(login(data as any));
    //   unwrapResult(action);
    //   history.push('/todo');
    // } catch (error) {
    //   throw error;
    // }
  }

  const isLoggedIn = !!accessToken;
  if (isLoggedIn) {
    return <Redirect to="/" />;
  }
  

  return (
    <form onSubmit={handleSubmit} className="login-card w-500px p-15px m-15px border-solid-1">
      <h2 className="text-center">Login</h2>
      <Input onChange={emailChange} type="email" value={email} className="my-15px" placeholder="Email"/>
      <Input.Password onChange={passwordChange} value={password} className="my-15px" placeholder="Password"/>
      <Button type="primary" size="large" htmlType="submit" className="my-15px w100">LOGIN</Button>
    </form> 
  );
}

export default LoginPage;