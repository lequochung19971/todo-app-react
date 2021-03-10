import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import loginApi, { LoginParams } from "../../api/loginApi"
import { RootState } from "../../app/store";
import { clearToken, saveAccessToken } from "../../shared/localStorage/localStoreage";

export interface LoginState {
  accessToken: string;
}

const initialState: LoginState = {
  accessToken: ''
}

export const login = createAsyncThunk(
  '@Login/doLogin',
  async (loginParams: LoginParams) => {
    const response = await loginApi.login(loginParams);
    return response.data;
  }
)

export const loginSlice = createSlice({
  name: '@Login',
  initialState,
  reducers: {
    doLogout(state) {
      clearToken();
      state.accessToken = '';
    }
  },
  extraReducers: {
    [login.fulfilled.toString()]: (state, action: PayloadAction<{access_token: string}>) => {
      state.accessToken = action.payload.access_token;
      saveAccessToken(state.accessToken)
    },
    '@Auth/LoginSucceeded': (state, action: PayloadAction<{access_token: string}>) => {
      state.accessToken = action.payload.access_token;
      saveAccessToken(state.accessToken)
    },
    '@Auth/LoginError': (state, _action: PayloadAction<{access_token: string}>) => {
      clearToken();
      state.accessToken = '';
    },
    '@Auth/LogoutSucceeded': (state, _action: PayloadAction<{access_token: string}>) => {
      clearToken();
      state.accessToken = '';
    }
  }
})

export const selectAccessToken = (state: RootState): string => state.login.accessToken; 

export const { doLogout } = loginSlice.actions;
export default loginSlice.reducer;