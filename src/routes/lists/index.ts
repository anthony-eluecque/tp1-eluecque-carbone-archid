import { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { ListsController } from '../../controllers/lists/lists.controller';

const lists : FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.get('/', ListsController.getLists);
    fastify.post('/', ListsController.createList);
    fastify.get('/:id/items', ListsController.getItemsFromList);
    fastify.post('/:id/items', ListsController.createItemInList);
    fastify.delete('/:id/items/:itemId', ListsController.deleteItemInList);
    fastify.put('/:id/items/:itemId', ListsController.updateItemInList);
}

export default lists;
