import {State, TodoItem, TodoList} from "../../types";
import {redisClient} from "../../../db";

interface RedisError extends Error {
    notFound?: boolean;
}

const isRedisError = (error: unknown): error is RedisError => {
    return typeof error === 'object' && error !== null && 'notFound' in error;
}

interface RepositoryResult<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string
}

export default class ListsRepository {

    getListById = async (id : string) : Promise<RepositoryResult<TodoList>> => {
        try {
            const client = await redisClient();
            const list = await client.get(`list:${id}`);
            if (!list)
                return {
                    success: false,
                    error: `List with id ${id} not found`,
                };
            return { 
                success: true, 
                data: JSON.parse(list),
                message: "List fetched"
            };
        } catch (error) {
            if (isRedisError(error) && error.notFound) {
                return { 
                    success: false, 
                    error: `List with id ${id} not found` 
                };
            }
            throw new Error(`Error fetching list with id ${id}`)
        }  
    }

    getLists = async () : Promise<TodoList[]> => {
        try {
            const client = await redisClient();
            const keys = await client.keys("list:*");
            const lists = await Promise.all(keys.map((key) => client.get(key)));
            return lists.map((list) => JSON.parse(list!));
        } catch (error) {
            throw new Error("Error fetching all list")
        }
    }

    createList = async(list : TodoList) : Promise<RepositoryResult<TodoList>> => {

        const client = await redisClient();
        const existingList = await this.getListById(list.id);

        if (existingList.success) {
            return { success: false, error: "List with this id is already existing" };
        }
        
        const newList : TodoList = {
            ...list,
            state : list.state ?? State.PENDING,
            items: list.items ?? []
        }

        await client.set(`list:${newList.id}`, JSON.stringify(newList));
        return { 
            success: true, 
            message: "List succesfully created",
            data: newList
        };
    }

    updateList = async (id : string, list : TodoList) : Promise<void> => {
        const client = await redisClient();
        await client.set(`list:${id}`, JSON.stringify(list));
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

        const client = await redisClient();
        await client.set(`list:${list.id}`, JSON.stringify(list));
        return { success: true, message: "Item succesfully deleted from list" };
    }

    updateItemInList = async (id : string, itemId : string, newItem : any) : Promise<RepositoryResult<null>> => {
        const listResult = await this.getListById(id);

        if (!listResult.success) {
            return { success: false, error: listResult.error };
        }

        const list = listResult.data!;
        const itemIndex = list.items.findIndex(item => item.id === newItem.id);

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

        const client = await redisClient();
        const list = listResult.data!;
        const existingItem = list.items.find(item => item.id === newItem.id);

        if (existingItem) {
            return { success: false, error: `Item with id ${newItem.id} already exists in list ${id}` };
        }

        list.items.push(newItem);
        await client.set(`list:${id}`, JSON.stringify(list));
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

        const client = await redisClient();
        const list = listResult.data!;
        list.state = state;
        await client.set(`list:${id}`, JSON.stringify(list));
        return {
            success: true, 
            message: "State updated" 
        }
    }
};