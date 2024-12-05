import {FastifyInstance, FastifyPluginAsync} from 'fastify';
import {ItemsController} from "../../controllers";


const items : FastifyPluginAsync = async (fastify: FastifyInstance) => {
    const itemsController = new ItemsController(fastify);

    fastify.get(
        '/:id',
        itemsController.getItemById.bind(itemsController)
    );

    fastify.post(
        '/:itemId/assign/:userId',
        itemsController.assignUserToItem.bind(itemsController)
    );
}

export default items;
