import axios, { AxiosRequestConfig } from 'axios';
import queryString from 'query-string';
import { getAccessToken } from '../shared/localStorage/localStoreage';

const http = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Expose-Headers': 'X-Pagination-Current-Page, X-Pagination-Total-Count',
    'Access-Control-Allow-Headers': 'X-Pagination-Current-Page, X-Pagination-Total-Count'
  },
  paramsSerializer: params => queryString.stringify(params)
});

http.interceptors.request.use(async (request) => {
  // Handle token for authorization
  const currentAccessToken = getAccessToken();
  if (currentAccessToken) {
    addToken(request, currentAccessToken);
  }

  return request;
})

const addToken = (request: AxiosRequestConfig, token: string) => {
  request.headers = {
    ...request.headers,
    Authorization: `Bearer ${token}`
  }
}

http.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error?.response?.status === 401) {
    // Reset token    
  }
  throw error;
})

export default http;