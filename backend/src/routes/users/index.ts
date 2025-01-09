import { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { UsersController } from '../../controllers';
import {schemas} from "../../schemas";

const users : FastifyPluginAsync = async (fastify: FastifyInstance) => {
    const usersController = new UsersController(fastify);

    fastify.get('/:id',
        { schema :  schemas.users.getUserById },
        usersController.getUserById.bind(usersController)
    );

    fastify.post('/',
        { schema :  schemas.users.createUser },
        usersController.createUser.bind(usersController)
    );
}

export default users;