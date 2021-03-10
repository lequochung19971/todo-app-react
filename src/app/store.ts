import { configureStore } from "@reduxjs/toolkit";
import todoReducer from '../features/Todo/todosSlice'
import loginReducer, { LoginState } from '../features/Login/loginSlice'
import { getAccessToken } from "../shared/localStorage/localStoreage";
import rootSaga, { sagaMiddleware } from "../features/Todo/sagas";

const preloadLoginState: LoginState = {
  accessToken: getAccessToken() || ''
}

const store = configureStore({
  reducer: {
    todo: todoReducer,
    login: loginReducer
  },
  preloadedState: {
    login: preloadLoginState
  },
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), sagaMiddleware]
})

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;