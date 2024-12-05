import { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { ListsController } from '../../controllers';

const lists : FastifyPluginAsync = async (fastify: FastifyInstance) => {
    const listsController = new ListsController(fastify);

    fastify.get(
        '/',
        listsController.getLists.bind(listsController)
    );

    fastify.get(
        '/:id',
        listsController.getListById.bind(listsController)
    );

    fastify.post(
        '/',
        listsController.createList.bind(listsController)
    );

    fastify.put(
        '/:id',
        listsController.modifyList.bind(listsController)
    );

    fastify.get(
        '/:id/items',
        listsController.getItemsFromList.bind(listsController)
    );

    fastify.post(
        '/:id/items',
        listsController.createItemInList.bind(listsController)
    );

    fastify.put(
        '/:id/items/:itemId',
        listsController.updateItemInList.bind(listsController)
    );

    fastify.delete(
        '/:id/items/:itemId',
        listsController.deleteItemInList.bind(listsController)
    );
}

export default lists;
