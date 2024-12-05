import { TodoItem } from "../item";
import { TodoList } from "../todo-list.types";

export interface RequestListUpdated extends Omit<TodoList, 'id'>{}
export interface RequestItemUpdated extends Omit<TodoItem, 'id'>{}



