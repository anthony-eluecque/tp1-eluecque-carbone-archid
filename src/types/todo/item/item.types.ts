import { EntityId } from "../../entity.types";
import { State } from "../../states.types";
import { User } from "../../user";

export interface TodoItem extends EntityId {
    description: string;
    state: State
    assignedTo: Array<User["id"]>
};
