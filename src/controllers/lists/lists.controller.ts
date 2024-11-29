import {List, RequestListUpdated} from '../../types';
import {FastifyReply, FastifyRequest} from 'fastify';

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