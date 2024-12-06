import { FastifyInstance } from "fastify";
import { State, TodoItem, TodoList } from "../../types";
import { } from "@fastify/leveldb"

interface LevelDBError extends Error {
    notFound?: boolean;
}

const isLevelDBError = (error: unknown): error is LevelDBError => {
    return typeof error === 'object' && error !== null && 'notFound' in error;
}

interface RepositoryResult<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string
}

export default class ListsRepository {

    constructor(private db : FastifyInstance) {}

    getListById = async (id : string) : Promise<RepositoryResult<TodoList>> => {
        try {
            const list = await this.db.level.lists.get(id);
            return { 
                success: true, 
                data: JSON.parse(list),
                message: "List fetched"
            };
        } catch (error) {
            if (isLevelDBError(error) && error.notFound) {
                return { 
                    success: false, 
                    error: `List with id ${id} not found` 
                };
            }
            throw new Error(`Error fetching list with id ${id}`)
        }  
    }

    getLists = async () : Promise<TodoList[]> => {
        const lists = this.db.level.lists.iterator();
        const result: TodoList[] = new Array<TodoList>();

        // @ts-ignore
        for await(const [_, value] of lists) { 
            result.push(JSON.parse(value));
        }
        return result;
    }

    createList = async(list : TodoList) : Promise<RepositoryResult<TodoList>> => {
        
        const listResult = await this.getListById(list.id);

        if (listResult.success) {
            return { success: false, error: "List with this id is existing" };
        }
        
        const newList : TodoList = {
            ...list,
            state : list.state ?? State.PENDING,
            items: list.items ?? []
        }

        await this.db.level.lists.put(newList.id, JSON.stringify(newList));
        return { 
            success: true, 
            message: "List succesfully created",
            data: newList
        };
    }

    updateList = async (id : string, list : TodoList) : Promise<void> => {
        await this.db.level.lists.put(id, JSON.stringify(list));
    }

    deleteItemInList = async (id : string, itemId : string) : Promise<RepositoryResult<null>> => {
        const listResult = await this.getListById(id);

        if (!listResult.success) {
            return { success: false, error: listResult.error };
        }
        const list = listResult.data!;

        const initialLength = list.items.length;
        list.items = list.items.filter(item => item.id !== itemId);

        if (list.items.length === initialLength) {
            return { success: false, error: `Item with id ${itemId} not found in list ${id}` };
        }
        
        await this.updateList(id, list);
        return { success: true };
    }

    updateItemInList = async (id : string, itemId : string, newItem : any) : Promise<RepositoryResult<null>> => {
        const listResult = await this.getListById(id);

        if (!listResult.success) {
            return { success: false, error: listResult.error };
        }

        if (!Object.values(State).includes(newItem.state)) {
            return { 
                success: false, 
                error: "Invalid state value" 
            };
        }

        const list = listResult.data!;

        const itemIndex = list.items.findIndex(item => item.id === itemId);

        if (itemIndex === -1) {
            return { success: false, error: `Item with id ${itemId} not found in list ${id}` };
        }

        list.items[itemIndex] = {
            ...list.items[itemIndex],
            ...newItem
        };
        await this.updateList(id, list);

        return { success: true, message: `Item with id ${itemId} updated in list ${id}` };
    }

    createItemInList = async (id : string, newItem : any) : Promise<RepositoryResult<null>> => {
        const listResult = await this.getListById(id);

        if (!listResult.success) {
            return { success: false, error: listResult.error };
        }
        
        if (!Object.values(State).includes(newItem.state)) {
            return { 
                success: false, 
                error: "Invalid state value" 
            };
        }

        const list = listResult.data!;        
        const existingItem = list.items.find(item => item.id === newItem.id);

        if (existingItem) {
            return { success: false, error: `Item with id ${newItem.id} already exists in list ${id}` };
        }

        list.items.push(newItem);
        await this.updateList(id, list);
        return { success: true, message: `Item with id ${newItem.id} added to list ${id}` };

    }

    getItemsInList = async (id : string) : Promise<RepositoryResult<TodoItem[]>> => {
        const listResult = await this.getListById(id);

        if (!listResult.success) {
            return { success: false, error: listResult.error };
        }

        const list = listResult.data!;  
        return {success : true, message: "Items fetched", data: list.items}
    }

    updateListState = async (id: string, state: State) : Promise<RepositoryResult<TodoList>> => {
        

        if (!Object.values(State).includes(state)) {
            return { 
                success: false, 
                error: "Invalid state value" 
            };
        }
    
        const listResult = await this.getListById(id);

        if (!listResult.success) {
            return { success: false, error: listResult.error };
        }

        const list = listResult.data!;
        list.state = state;
        await this.updateList(id, list);
        return {
            success: true, 
            message: "State updated" 
        }
    }
};