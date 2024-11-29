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
        const db = request.server.level;
        const { id } = request.params as { id:string }
        const list = await db.lists.get(id);

        reply.send(JSON.parse(list) as List);
    }

    static async createList(request: FastifyRequest, reply: FastifyReply) {
        const newList : List = request.body as List;
        const db = request.server.level;
        await db.lists.put(newList.id, JSON.stringify(newList));
        return reply.send({message: "List created"});
    }   

    static async getItemsFromList(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };

        const db = request.server.level;
        const list = await db.lists.get(id);
        const items = JSON.parse(list).items;
        
        return reply.send(items);
    }

    static async createItemInList(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        const newItem = request.body;
        
        const db = request.server.level;
        
        const list = await db.lists.get(id);
        const listParsed = JSON.parse(list);
        
        listParsed.items.push(newItem);
        await db.lists.put(id, JSON.stringify(listParsed));
        
        return reply.send({message: "Item created"});
    }

    static async deleteItemInList(request: FastifyRequest, reply: FastifyReply) {
        const { id, itemId } = request.params as { id: string, itemId: string };
        
        const db = request.server.level;
        
        const list = await db.lists.get(id);
        const listParsed = JSON.parse(list);
        
        listParsed.items = listParsed.items.filter((item: Item) => item.id !== itemId);
        await db.lists.put(id, JSON.stringify(listParsed));
        
        return reply.send({message: "Item deleted"});
    }

    static async updateItemInList(request: FastifyRequest, reply: FastifyReply) {
        const { id, itemId } = request.params as { id: string, itemId: string };
        const newItem = request.body;
        
        const db = request.server.level;
        
        const list = await db.lists.get(id);
        const listParsed = JSON.parse(list);
        
        listParsed.items = listParsed.items.map((item: Item) => {
            if(item.id === itemId) {
                return newItem;
            }
            return item;
        });
        await db.lists.put(id, JSON.stringify(listParsed));
        
        return reply.send({message: "Item updated"});
    }

    static async modifyList(request: FastifyRequest, reply: FastifyReply) {
        const db = request.server.level;
        const { id } = request.params as { id:string }
        const list = await db.lists.get(id);

        const listUpdated: RequestListUpdated = request.body as RequestListUpdated;
        console.log(listUpdated);
        const parsedList = {...JSON.parse(list), ...listUpdated}

        await db.lists.put(id, JSON.stringify(parsedList));
        return reply.send({message: "List updated !", data: parsedList})
    }
}