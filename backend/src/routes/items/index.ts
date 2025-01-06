import {FastifyInstance, FastifyPluginAsync} from 'fastify';
import {ItemsController} from "../../controllers";
import {schemas} from "../../schemas";


const items : FastifyPluginAsync = async (fastify: FastifyInstance) => {
    const itemsController = new ItemsController(fastify);

    fastify.get(
        '/:id',
        { schema :  schemas.items.getItemById },
        itemsController.getItemById.bind(itemsController)
    );

    fastify.post(
        '/:itemId/assign/:userId',
        { schema :  schemas.items.assignUserToItem },
        itemsController.assignUserToItem.bind(itemsController)
    );
}

export default items;
