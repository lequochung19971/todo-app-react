import { unwrapResult } from '@reduxjs/toolkit';
import { Button, Input } from 'antd';
import React, { ChangeEvent, FormEvent, ReactElement, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { sagaCreateTodo } from '../sagas';
import { addNewTodo } from '../todosSlice';

function AddingForm(): ReactElement {
  const [input, setInput]= useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const onchange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  }

  const resetInput = () => {
    setInput('')
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (input) {
      setIsLoading(true);
      const actionResult = await dispatch(addNewTodo(input));
      unwrapResult(actionResult);
      // await dispatch(sagaCreateTodo(input));
      resetInput();
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="d-flex">
      <Input onChange={onchange} value={input}/>
      <Button type="primary" htmlType="submit" loading={isLoading}>Add</Button>
    </form>
  );
}

export default AddingForm;