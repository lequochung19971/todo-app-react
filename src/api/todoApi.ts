import { AxiosResponse } from "axios";
import { Todo } from "../shared/interfaces-enum/Todo.interface";
import http from "./http";
interface TodoApiPrams {
  [key: string]: any
}

const todoUrl = '/todos';

const todoApi = {
  getTodos (params?: TodoApiPrams): Promise<AxiosResponse<any>> {
    return http.get(todoUrl, { params });
  },

  postTodo (data: Todo): Promise<AxiosResponse<any>> {
    return http.post(todoUrl, data);
  },

  putTodo (id: string, data: TodoApiPrams): Promise<AxiosResponse<any>> {
    const url = `${todoUrl}/${id}`;
    return http.put(url, data);
  },

  deleteTodo (id: string):  Promise<AxiosResponse<any>> {
    const url = `${todoUrl}/${id}`;
    return http.delete(url);
  },
}

export default todoApi;