export interface List {
    id : string;
    name : string;
    description?: string;
    items?: Array<Item>
}

export interface Item {
    id: string;
    description: string;
    state: State
}

export enum State { "PENDING", "IN-PROGRESS", "DONE" }
