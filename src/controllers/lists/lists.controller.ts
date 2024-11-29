import { List } from '../../types';
import { FastifyRequest, FastifyReply } from 'fastify';

export class ListsController {

    static async getLists(request: FastifyRequest, reply: FastifyReply) {
        const db = request.server.level;
        const lists = db.lists.iterator();
        const result: List[] = []

        for await(const [_, value] of lists) {
            result.push(JSON.parse(value) as List);
        }
        reply.send(result);
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
}