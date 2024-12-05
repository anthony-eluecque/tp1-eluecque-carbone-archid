import { EntityId } from "../entity.types";
import { State } from "../states.types";
import { TodoItem } from "./item";

export interface TodoList extends EntityId {
    name : string;
    description: string;
    items: Array<TodoItem>;
    state: State;
};