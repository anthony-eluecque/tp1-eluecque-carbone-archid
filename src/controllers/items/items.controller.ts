import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import {Res} from "../../helpers";
import {HttpStatusCode} from "../../types";
import {ItemsRepository} from "../../repositories";

export class ItemsController {

    private readonly _repository: ItemsRepository;

    constructor(server: FastifyInstance) {
        this._repository = new ItemsRepository(server);
    }

    async getItemById(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id:string };
            const result = await this._repository.getItemById(id);

            if (!result.success) {
                Res.send(reply, HttpStatusCode.NOT_FOUND, result.error!)
            }
            Res.send(reply, HttpStatusCode.OK, result.message!, result.data);
        } catch (error) {
            Res.error(reply, HttpStatusCode.INTERNAL_SERVER_ERROR, "Error while fetching items", error);
        }
    }

    async assignUserToItem(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { itemId, userId } = request.params as { itemId: string, userId: string };
            const result = await this._repository.getItemById(itemId);

            if (!result.success) {
                Res.send(reply, HttpStatusCode.NOT_FOUND, result.error!)
            }

            const item = result.data!;
            item.assignedTo.push(userId);
            await this._repository.updateItem(itemId, item);
            Res.send(reply, HttpStatusCode.OK, result.message!, item);

        } catch (error) {
            Res.error(reply, HttpStatusCode.INTERNAL_SERVER_ERROR, "Error while assigning user to an item", error);
        }
    }

}