import { EntityId } from "../entity.types";
import { TodoItem } from "./item";

export interface TodoList extends EntityId {
    name : string;
    description: string;
    items: Array<TodoItem>
};