import { Status } from './Status.enum';

export interface Todo {
  id: string,
  status: Status,
  value: string,
  createdDate: string
}
