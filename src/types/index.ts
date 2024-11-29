export interface List {
    id : string;
    name : string;
    description: string;
    items: Array<Item>
}

export interface RequestListUpdated extends Omit<List, 'id'>{}
export interface RequestItemUpdated extends Omit<Item, 'id'>{}

export interface Item {
    id: string;
    description: string;
    state: State
}

export enum State { "PENDING", "IN-PROGRESS", "DONE" }
