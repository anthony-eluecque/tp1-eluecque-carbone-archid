import { FastifyInstance } from "fastify";
import { List } from "../../types";

export default class ListsRepository {

    constructor(private db : FastifyInstance) {}

    getListById = async (id : string) : Promise<List> => {
        const list = await this.db.level.lists.get(id);
        return JSON.parse(list);
    }

    getLists = async () : Promise<List[]> => {
        const lists = this.db.level.lists.iterator();
        const result: List[] = []

        // @ts-ignore
        for await(const [_, value] of lists) { 
            result.push(JSON.parse(value));
        }
        return result;
    }

    createList = async(list : List) : Promise<void> => {
        await this.db.level.lists.put(list.id, JSON.stringify(list));
    }

    updateList = async (id : string, list : List) : Promise<void> => {
        await this.db.level.lists.put(id, JSON.stringify(list));
    }

    deleteItemInList = async (id : string, itemId : string) : Promise<void> => {
        const list = await this.getListById(id);
        list.items = list.items.filter(item => item.id !== itemId);
        await this.updateList(id, list);
    }

    updateItemInList = async (id : string, itemId : string, item : any) : Promise<void> => {
        const list = await this.getListById(id);
        list.items = list.items.map(i => i.id === itemId ? item : i);
        await this.updateList(id, list);
    }

    createItemInList = async (id : string, item : any) : Promise<void> => {
        const list = await this.getListById(id);
        list.items.push(item);
        await this.updateList(id, list);
    }
};