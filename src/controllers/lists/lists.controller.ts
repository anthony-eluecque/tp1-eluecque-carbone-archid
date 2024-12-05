import { Res } from '../../helpers';
import { ListsRepository } from '../../repositories';
import { 
    TodoItem, 
    TodoList, 
    RequestListUpdated, 
    HttpStatusCode, 
    ListParams, 
    ItemsParams, 
    State
} from '../../types';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';

export class ListsController {

    private readonly _repository: ListsRepository;

    constructor(server: FastifyInstance) {
        this._repository = new ListsRepository(server);
    }

    async getLists(_: FastifyRequest, reply: FastifyReply) {
        try {
            const result = await this._repository.getLists();
            Res.send(reply, HttpStatusCode.OK, "Lists fetched", result);
        } catch (error) {
            Res.error(reply, HttpStatusCode.INTERNAL_SERVER_ERROR, "Error while fetching lists", error);
        }
    }

    async getListById(request: FastifyRequest<ListParams>, reply: FastifyReply) {
        try {
            const { id } = request.params;
            const result = await this._repository.getListById(id);

            if (!result.success) {
                Res.send(reply, HttpStatusCode.NOT_FOUND, result.error!)
            }
            Res.send(reply, HttpStatusCode.OK, result.message!, result.data);
        } catch (error) {
            Res.error(reply, HttpStatusCode.INTERNAL_SERVER_ERROR, "Error while fetching lists", error);
        }
    }

    async createList(request: FastifyRequest<ListParams>, reply: FastifyReply) {
        try {
            const newList : TodoList = request.body as TodoList;
            const result = await this._repository.createList(newList);

            if (!result.success) {
                Res.send(reply, HttpStatusCode.CONFLICT, result.error!)
            }

            Res.send(reply, HttpStatusCode.CREATED, result.message!, result.data)
        } catch (error) {
            Res.error(reply, HttpStatusCode.INTERNAL_SERVER_ERROR, "Error while creating list", error);
        }

    }   

    async getItemsFromList(request: FastifyRequest<ListParams>, reply: FastifyReply) {
        try {
            const { id } = request.params as { id:string };
            const result = await this._repository.getItemsInList(id);

            if (!result.success) {
                Res.send(reply, HttpStatusCode.NOT_FOUND, result.error!)
            }         
            const items = result.data!;
            Res.send(reply, HttpStatusCode.OK, "Item fetched", items);            
        } catch (error) {
            Res.error(reply, HttpStatusCode.INTERNAL_SERVER_ERROR, "Error while fetching list", error);
        }
    }

    async createItemInList(request: FastifyRequest<ListParams>, reply: FastifyReply) {
        try {
            const { id } = request.params;
            const newItem : TodoItem = request.body as TodoItem;
            const result = await this._repository.createItemInList(id, newItem);
            
            if (!result.success) {
                Res.send(reply, HttpStatusCode.CONFLICT, result.error!);
            }

            const list = await this._repository.getListById(id);        
            Res.send(reply, HttpStatusCode.CREATED, "Item created in the list", list);
        } catch (error) {
            Res.error(reply, HttpStatusCode.INTERNAL_SERVER_ERROR, "Error while creating item", error)
        }
    }

    async deleteItemInList(request: FastifyRequest<ItemsParams>, reply: FastifyReply) {
        try {
            const { id, itemId } = request.params as { id: string, itemId: string };
            const result = await this._repository.deleteItemInList(id, itemId);        
            
            if (!result.success) {
                Res.send(reply, HttpStatusCode.NOT_FOUND, result.error!);
            }
            
            Res.send(reply, HttpStatusCode.NO_CONTENT, "Item deleted");
        } catch (error) {
            Res.error(reply, HttpStatusCode.INTERNAL_SERVER_ERROR, "Error while deleting item", error);
        }
  
    }

    async updateItemInList(request: FastifyRequest<ItemsParams>, reply: FastifyReply) {
        try {
            const { id, itemId } = request.params;
            const newItem = request.body;
            const result = await this._repository.updateItemInList(id, itemId, newItem);        
            
            if (!result.success) {
                Res.send(reply, HttpStatusCode.NOT_FOUND, result.error!);
            }
            
            Res.send(reply, HttpStatusCode.OK, result.message!, newItem)   
        } catch (error) {
            Res.error(reply, HttpStatusCode.INTERNAL_SERVER_ERROR, "Error while updating item", error);
        }
    }

    async modifyList(request: FastifyRequest<ListParams>, reply: FastifyReply) {
        try {   
            const { id } = request.params
            const result = await this._repository.getListById(id);

            if (!result.success) {
                Res.send(reply, HttpStatusCode.NOT_FOUND, result.error!);
            }

            const listUpdated: RequestListUpdated = request.body as RequestListUpdated;
            const parsedList = {...result.data!, ...listUpdated}
            this._repository.updateList(id, parsedList)

            Res.send(reply, HttpStatusCode.OK, "List updated", parsedList)
        } catch (error) {
            Res.error(reply, HttpStatusCode.INTERNAL_SERVER_ERROR, "Error while updating list", error);
        }
    }

    async changeListState(request : FastifyRequest, reply: FastifyReply) {
        try {
            const { id, state } = request.params as { id : string, state: State }
            const result = await this._repository.getListById(id);

            if (!result.success) {
                Res.send(reply, HttpStatusCode.NOT_FOUND, result.error!);
            }
        
            const stateResult = await this._repository.updateListState(id, state);

            if (!stateResult.success) {
                Res.send(reply, HttpStatusCode.BAD_REQUEST, stateResult.error!);
            }

            Res.send(reply, HttpStatusCode.OK, stateResult.message!);            
        } catch (error) {
            Res.error(reply, HttpStatusCode.INTERNAL_SERVER_ERROR, "Error while updating state's list", error);
        }
    }
}