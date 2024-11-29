import { Res } from '../../helpers';
import { Item, List, RequestListUpdated } from '../../types';
import { FastifyRequest, FastifyReply } from 'fastify';

export class ListsController {

    static async getLists(request: FastifyRequest, reply: FastifyReply) {
        try {
            const db = request.server.level;
            const lists = db.lists.iterator();
            const result: List[] = []

            // @ts-ignore
            for await(const [_, value] of lists) { 
                result.push(JSON.parse(value) as List);
            }
            Res.send(reply, 200, "Lists fetched", result);
        } catch (error) {
            Res.error(reply, 500, "Error while fetching lists", error);
        }
    }

    static async getListById(request: FastifyRequest, reply: FastifyReply) {
        try {
            const db = request.server.level;
            const { id } = request.params as { id:string }
            const list = await db.lists.get(id);

            Res.send(reply, 200, "List fetched", JSON.parse(list));
        } catch (error) {
            Res.error(reply, 500, "Error while fetching lists", error);
        }
    }

    static async createList(request: FastifyRequest, reply: FastifyReply) {
        try {
            const newList : List = request.body as List;

            const db = request.server.level;
            const lists = await db.lists.iterator();

            // @ts-ignore
            for await(const [_, value] of lists)
                if(JSON.parse(value).id == newList.id)
                    Res.send(reply, 409, "ID already existing", JSON.parse(value));

            await db.lists.put(newList.id, JSON.stringify(newList));
            Res.send(reply, 200, "List created", newList);
        } catch (error) {
            Res.error(reply, 500, "Error while creating list", error);
        }
    }   

    static async getItemsFromList(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };

            const db = request.server.level;
            const list = await db.lists.get(id);
            const items = JSON.parse(list).items;

            Res.send(reply, 200, "Items fetched", items)
        } catch (error) {
            Res.error(reply, 500, "Error while fetching list", error);
        }
    }

    static async createItemInList(request: FastifyRequest, reply: FastifyReply) {
        try {
            const {id} = request.params as { id: string };
            const newItem = request.body;

            const db = request.server.level;

            const list = await db.lists.get(id);
            const listParsed = JSON.parse(list);

            listParsed.items.push(newItem);
            await db.lists.put(id, JSON.stringify(listParsed));

            Res.send(reply, 200, "Item created in the list", listParsed)
        } catch (error) {
            console.error(error)
            Res.error(reply, 500, "Error while creating item", error);
        }
    }

    static async deleteItemInList(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id, itemId } = request.params as { id: string, itemId: string };

            const db = request.server.level;

            const list = await db.lists.get(id);
            const listParsed = JSON.parse(list);

            listParsed.items = listParsed.items.filter((item: Item) => item.id !== itemId);
            await db.lists.put(id, JSON.stringify(listParsed));

            Res.send(reply, 200, "Item deleted", listParsed);
        } catch (error) {
            console.error(error)
            Res.error(reply, 500, "Error while deleting item", error);
        }
    }

    static async updateItemInList(request: FastifyRequest, reply: FastifyReply) {
        try {
            const {id, itemId} = request.params as { id: string, itemId: string };
            const newItem = request.body;

            const db = request.server.level;

            const list = await db.lists.get(id);
            const listParsed = JSON.parse(list);

            listParsed.items = listParsed.items.map((item: Item) => {
                if (item.id === itemId) {
                    return newItem;
                }
                return item;
            });
            await db.lists.put(id, JSON.stringify(listParsed));

            Res.send(reply, 200, "Item updated", listParsed)
        } catch (error) {
            console.error(error)
            Res.error(reply, 500, "Error while updating item", error);
        }
    }

    static async modifyList(request: FastifyRequest, reply: FastifyReply) {
        try {
            const db = request.server.level;
            const {id} = request.params as { id: string }
            const list = await db.lists.get(id);

            const listUpdated: RequestListUpdated = request.body as RequestListUpdated;
            const parsedList = {...JSON.parse(list), ...listUpdated}
            await db.lists.put(id, JSON.stringify(parsedList));

            Res.send(reply, 200, "List updated", parsedList)
        } catch (error) {
            console.error(error)
            Res.error(reply, 500, "Error while updating list", error);
        }
    }
}