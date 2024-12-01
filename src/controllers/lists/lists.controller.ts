import { Res } from '../../helpers';
import { ListsRepository } from '../../repositories/lists';
import { Item, List, RequestListUpdated } from '../../types';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';

export class ListsController {

    private _repository: ListsRepository;

    constructor(server: FastifyInstance) {
        this._repository = new ListsRepository(server);
    }

    async getLists(request: FastifyRequest, reply: FastifyReply) {
        try {
            const result = await this._repository.getLists();
            Res.send(reply, 200, "Lists fetched", result);
        } catch (error) {
            Res.error(reply, 500, "Error while fetching lists", error);
        }
    }

    async getListById(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id:string }
            const result = await this._repository.getListById(id);

            if (!result.success) {
                Res.send(reply, 404, result.error!)
            }
            Res.send(reply, 200, result.message!, result.data);
        } catch (error) {
            Res.error(reply,500, "Error while fetching lists", error);
        }
    }

    async createList(request: FastifyRequest, reply: FastifyReply) {
        try {
            const newList : List = request.body as List;
            await this._repository.createList(newList);
            Res.send(reply, 200, "created new list", newList)
        } catch (error) {
            Res.error(reply, 500, "Error while creating list", error);
        }

    }   

    async getItemsFromList(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id:string }
            const result = await this._repository.getItemsInList(id);

            if (!result.success) {
                Res.send(reply, 404, result.error!)
            }         
            const items = result.data!;
            Res.send(reply, 200, "Item fetched", items);            
        } catch (error) {
            Res.error(reply, 500, "Error while fetching list", error);
        }
    }

    async createItemInList(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const newItem = request.body as Item;
            const result = await this._repository.createItemInList(id, newItem);
            
            if (!result.success) {
                Res.send(reply, 404, result.error!);
            }

            const list = await this._repository.getListById(id);        
            Res.send(reply, 200, "Item created in the list", list);
        } catch (error) {
            Res.error(reply, 500, "Error while creating item", error)
        }
 
    }

    async deleteItemInList(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id, itemId } = request.params as { id: string, itemId: string };
            const result = await this._repository.deleteItemInList(id, itemId);        
            
            if (!result.success) {
                Res.send(reply, 404, result.error!);
            }
            
            Res.send(reply, 200, "Item deleted");
        } catch (error) {
            Res.error(reply, 500, "Error while deleting item", error);
        }
  
    }

    async updateItemInList(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id, itemId } = request.params as { id: string, itemId: string };
            const newItem = request.body;
            const result = await this._repository.updateItemInList(id, itemId, newItem);        
            
            if (!result.success) {
                Res.send(reply, 404, result.error!);
            }
            
            Res.send(reply,200, result.message!, newItem)   
        } catch (error) {
            Res.error(reply, 500, "Error while updating item", error);
        }
    }

    async modifyList(request: FastifyRequest, reply: FastifyReply) {
        try {   
            const { id } = request.params as { id:string }
            const result = await this._repository.getListById(id);

            if (!result.success) {
                Res.send(reply, 404, result.error!);
            }

            const listUpdated: RequestListUpdated = request.body as RequestListUpdated;
            const parsedList = {...result.data!, ...listUpdated}
            this._repository.updateList(id, parsedList)

            Res.send(reply, 200, "List updated", parsedList)
        } catch (error) {
            console.error(error)
            Res.error(reply, 500, "Error while updating list", error);
        }
    }
}