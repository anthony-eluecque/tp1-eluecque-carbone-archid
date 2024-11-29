import { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { ListsController } from '../../controllers/lists/lists.controller';

const lists : FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.get('/', ListsController.getLists);
    fastify.post('/', ListsController.createList);
}

export default lists;
