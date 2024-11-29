export interface List {
    id : string;
    name : string;
}

export interface RequestListUpdated extends Omit<List, 'id'>{}