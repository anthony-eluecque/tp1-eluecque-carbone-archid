import { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { ListsController } from '../../controllers';

const lists : FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.get('/', ListsController.getLists);
    fastify.post('/', ListsController.createList);
    fastify.get('/:id', ListsController.getListById);
    fastify.put('/:id', ListsController.modifyList);
}

export default lists;
