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
}