import { createAction, nanoid, PayloadAction, PayloadActionCreator } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { delay, StrictEffect, fork, cancel, call, put, takeEvery, select, all, take, race, spawn, actionChannel } from "redux-saga/effects";
import loginApi, { LoginParams } from "../../api/loginApi";
import todoApi from "../../api/todoApi";
import { Status } from "../../shared/interfaces-enum/Status.enum";
import { Todo } from "../../shared/interfaces-enum/Todo.interface";

export const sagaMiddleware = createSagaMiddleware();

export function createActionSaga<P = void>(type: string, status: 'Succeeded' | 'Error'): PayloadActionCreator<P, string> {
  return createAction<P>(`${type}${status}`);
}

export function createActionError<P = void>(type: string): PayloadActionCreator<P, string> {
  return createActionSaga(type, 'Error');
}

export function createActionSucceeded<P = void>(type: string): PayloadActionCreator<P, string> {
  return createActionSaga(type, 'Succeeded');
}

function* fetchTodos(): Generator<StrictEffect, void, any> {
  const name = '@Todos/fetchTodos';
  try {
    const response = yield fork(todoApi.getTodos);
    const fetchTodosSucceeded = createActionSaga<Todo[]>(name, 'Succeeded');
    yield put(fetchTodosSucceeded(response.data));
  } catch (error) {
    const fetchTodosError = createActionError<any>('@Auth/Login');
    yield put(fetchTodosError(error))  }
} 

function* fetchTodosWithTimeout(): Generator<StrictEffect, void, any> {
  const {response, timeout} = yield race({
    response: call(todoApi.getTodos),
    timeout: delay(1000),
  })
  console.log('timeout', timeout)
  if (response)
    console.log('POSTS_RECEIVED', response)
    // yield put({type: 'POSTS_RECEIVED', todos})
  else
    console.log('TIMEOUT_ERROR')
    // yield put({type: 'TIMEOUT_ERROR'})
}

function* createTodo(action: PayloadAction<string>): Generator<StrictEffect, void, any> {
  const name = '@Todos/createTodo';
  try {
    const data: Todo = {
      id: nanoid(),
      value: action.payload,
      createdDate: (new Date()).toISOString(),
      status: Status.ALL
    }
    const response = yield call(todoApi.postTodo, data);

    const todoSucceeded = createActionSaga<Todo>(name, 'Succeeded');
    yield put(todoSucceeded(response.data));
  } catch (error) {
    const loginError = createActionError<any>('@Auth/Login');
    yield put(loginError(error))
  }
}

function* watchAndLog(): Generator<StrictEffect, void, any> {
  while (true) {
    const action = yield take('*')
    const state = yield select()

    console.log('action', action)
    console.log('state after', state)
  }
}

function *authorize(params: LoginParams): Generator<StrictEffect, void, any> {
  try {
    const response = yield call(loginApi.login, params);

    const loginSucceed = createActionSucceeded<any>('@Auth/Login');
    yield put(loginSucceed(response.data));
  } catch (error) {
    const loginError = createActionError<any>('@Auth/Login');
    yield put(loginError(error))
  }
}

function* doLogout(): Generator<StrictEffect, void, any> {
  while (true) {
    yield take('@Auth/Logout');
    const logoutSucceed = createActionSucceeded('@Auth/Logout');
    yield put(logoutSucceed)
  }

}

function* loginFlow(): Generator<StrictEffect, void, any> {
  while (true) {
    const { payload: { email, password } } = yield take('@Auth/Login');
    const task = yield fork(authorize, {email, password});

    const action = yield take(['@Auth/Logout', '@Auth/LoginError'])
    if (action.type === '@Auth/Logout') {
      yield cancel(task)
    }

    const logoutSucceed = createActionSucceeded('@Auth/Logout');
    yield put(logoutSucceed)
  }
}


export default function* rootSaga(): Generator<StrictEffect, void, any> {
  yield all([
    yield takeEvery('@Todos/sagaFetchTodos', fetchTodos),
    yield takeEvery('@Todos/sagaFetchTodosTimeout', fetchTodosWithTimeout),
    yield takeEvery('@Todos/sagaCreateTodo', createTodo),
    yield fork(doLogout),
    yield fork(loginFlow),
    yield fork(watchAndLog),
  ])
}

export const sagaFetchTodos = createAction('@Todos/sagaFetchTodos');
export const sagaFetchTodosTimeout = createAction('@Todos/sagaFetchTodosTimeout');
export const sagaCreateTodo = createAction<string>('@Todos/sagaCreateTodo');
export const sagaLogin = createAction<LoginParams>('@Auth/Login');
export const sagaLogout = createAction('@Auth/Logout');
