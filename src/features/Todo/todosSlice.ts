import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, nanoid, PayloadAction, Update } from "@reduxjs/toolkit";
import todoApi from "../../api/todoApi";
import { RootState } from "../../app/store";
import { Status } from "../../shared/interfaces-enum/Status.enum";
import { Todo } from "../../shared/interfaces-enum/Todo.interface";

export interface TodosState {
  loading: boolean,
  statusBar: Status,
}

const todosAdapter = createEntityAdapter<Todo>();

const initialState = todosAdapter.getInitialState({
  loading: false,
  statusBar: Status.ALL
})

export const addNewTodo = createAsyncThunk<Todo, string>(
  '@Todo/addNewTodo', 
  async (value) => {
    const data: Todo = {
      id: nanoid(),
      value,
      createdDate: (new Date()).toISOString(),
      status: Status.ALL
    }
    const response = await todoApi.postTodo(data);
    return response.data as Todo;
  }
)

export const fetchTodos = createAsyncThunk(
  '@Todo/fetchTodos',
  async () => {
    const response = await todoApi.getTodos();
    return response.data as Todo[];
  }
)

export const updateTodoStatus = createAsyncThunk(
  '@Todo/updateTodo',
  async ({todo, status}: {todo: Todo, status: Status}) => {
    const dataRequest = {
      ...todo,
      status
    }
    const response = await todoApi.putTodo(dataRequest.id, dataRequest);
    return response.data as Todo;
  }
)

export const removeTodo = createAsyncThunk(
  '@Todo/removeTodo',
  async (todoId: string) => {
    await todoApi.deleteTodo(todoId);
    return todoId;
  }
)

const todosSlice = createSlice({
  name: '@Todo',
  initialState,
  reducers: {
    setStatusBar(state, action: PayloadAction<Status>) {
      state.statusBar = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    }
  },
  extraReducers: {
    [addNewTodo.pending.toString()]: (state) => {
      state.loading = true;
    },
    [addNewTodo.fulfilled.toString()]: (state, action: PayloadAction<Todo>) => {
      todosAdapter.addOne(state, action.payload);
      state.loading = false;
    },
    [fetchTodos.pending.toString()]: (state) => {
      state.loading = true;
    },
    [fetchTodos.fulfilled.toString()]: (state, action: PayloadAction<Todo[]>) => {
      todosAdapter.setAll(state, action.payload)
      state.loading = false;
    },
    [updateTodoStatus.fulfilled.toString()]: (state, action: PayloadAction<Todo>) => {
      const todo = action.payload;
      const update: Update<Todo> = {
        id: todo.id,
        changes: todo
      };
      todosAdapter.updateOne(state, update)
    },
    [removeTodo.fulfilled.toString()]: (state, action: PayloadAction<string>) => {
      const todoId = action.payload;
      todosAdapter.removeOne(state, todoId);
    },
    "@Todos/fetchTodosSucceeded": (state, action: PayloadAction<Todo[]>) => {
      console.log("@Todos/fetchTodosSucceeded");
      console.log(state);
      console.log(action);
    },
    "@Todos/fetchTodosError": (state, action: PayloadAction<Todo[]>) => {
      console.log('@Todos/fetchTodosErro');
      console.log(action);
    },
    "@Todos/createTodoSucceeded": (state, action: PayloadAction<Todo>) => {
      console.log("@Todos/createTodoSucceeded");
      console.log(state);
      console.log(action.payload);
    }
  }
})

const {
  selectAll: selectAllTodos
} = todosAdapter.getSelectors<RootState>(state => state.todo);

export const selectLoading = (state: RootState): boolean => state.todo.loading;
export const selectStatusBar = (state: RootState): Status => state.todo.statusBar;

export const selectTodosBasedOnStatusBard = createSelector(
  selectAllTodos,
  selectStatusBar,
  (todos, statusBar) => {
    if (statusBar === Status.ALL) {
      return todos;
    }
    
    return todos.filter((todo) => todo.status === statusBar);
  }
)

export const selectTodoById = createSelector(
  selectAllTodos,
  (_state: RootState, todoId: string) => todoId,
  (todos, todoId) => todos.find(todo => todo.id === todoId)
)

export const { setStatusBar } = todosSlice.actions;
export default todosSlice.reducer;