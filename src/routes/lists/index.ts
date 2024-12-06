import { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { ListsController } from '../../controllers';
import { schemas } from '../../schemas';

const lists : FastifyPluginAsync = async (fastify: FastifyInstance) => {
    const listsController = new ListsController(fastify);

    fastify.get(
        '/',
        { schema :  schemas.lists.getLists },
        listsController.getLists.bind(listsController)
    );

    fastify.get(
        '/:id',
        { schema : schemas.lists.getListById },
        listsController.getListById.bind(listsController)
    );

    fastify.post(
        '/',
        { schema : schemas.lists.createList },
        listsController.createList.bind(listsController)
    );

    fastify.put(
        '/:id',
        { schema : schemas.lists.updateList },
        listsController.modifyList.bind(listsController)
    );

    fastify.get(
        '/:id/items',
        { schema : schemas.lists.getItemsInList },
        listsController.getItemsFromList.bind(listsController)
    );

    fastify.post(
        '/:id/items',
        { schema : schemas.lists.createItemInList },
        listsController.createItemInList.bind(listsController)
    );

    fastify.put(
        '/:id/items/:itemId',
        listsController.updateItemInList.bind(listsController)
    );

    fastify.delete(
        '/:id/items/:itemId',
        { schema : schemas.lists.deleteItemInList },
        listsController.deleteItemInList.bind(listsController)
    );

    fastify.put('/:id/status/:state', listsController.changeListState.bind(listsController));
}

export default lists;