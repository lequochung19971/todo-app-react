import { AxiosResponse } from "axios";
import http from "./http";

export interface LoginParams {
  email: string;
  password: string;
}

const loginUrl = '/auth/login';

const loginApi = {
  login (params: LoginParams): Promise<AxiosResponse<any>> {
    return http.post(loginUrl, params);
  }
}

export default loginApi;