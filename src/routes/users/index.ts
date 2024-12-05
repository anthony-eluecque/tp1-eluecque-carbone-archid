import { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { UsersController } from '../../controllers';

const users : FastifyPluginAsync = async (fastify: FastifyInstance) => {
    const usersController = new UsersController(fastify);

    fastify.get('/:id',
        usersController.getUserById.bind(usersController)
    );

    fastify.post('/',
        usersController.createUser.bind(usersController)
    );
}

export default users;