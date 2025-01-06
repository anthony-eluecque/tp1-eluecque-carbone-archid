import fp from 'fastify-plugin'
import swagger, {FastifySwaggerOptions} from '@fastify/swagger'
import JsonSchemas from '../schemas/all.json'

export default fp<FastifySwaggerOptions>(async (fastify) => {
    fastify.addSchema({
        "$id": "TodoList",
        ...JsonSchemas.definitions.TodoList,
    });

    fastify.addSchema({
        "$id": "TodoItem",
        ...JsonSchemas.definitions.TodoItem,
    });

    fastify.addSchema({
        "$id": "State",
        ...JsonSchemas.definitions.State,
    });

    fastify.addSchema({
        "$id": "TodoListsResponse",
        ...JsonSchemas.definitions.GetListsResponse,
    });

    fastify.addSchema({
        "$id": "TodoListResponse",
        ...JsonSchemas.definitions.GetListByIdResponse,
    });

    fastify.addSchema({
        "$id": "NotFoundResponse",
        ...JsonSchemas.definitions.NotFoundResponse,
    });

    fastify.addSchema({
        "$id": "ConflictResponse",
        ...JsonSchemas.definitions.ConflictResponse,
    });

    fastify.addSchema({
        "$id": "TodoItemsResponse",
        ...JsonSchemas.definitions.GetItemsInList,
    });

    fastify.addSchema({
        "$id": "NoContentResponse",
        ...JsonSchemas.definitions.NoContentResponse,
    });

      fastify.addSchema({
        "$id": "BadRequest",
        ...JsonSchemas.definitions.BadRequest
      });

    fastify.addSchema({
        "$id": "TodoItemResponse",
        ...JsonSchemas.definitions.GetItemById,
    });

    fastify.addSchema({
        "$id": "User",
        ...JsonSchemas.definitions.User,
    })

    fastify.addSchema({
        "$id": "UserResponse",
        ...JsonSchemas.definitions.GetUserById,
    })

    fastify.register(swagger, {
        openapi: {
          info: { title: 'Todo API', version: '1.0.0' },
          servers: [
            {
              url: 'http://localhost:3000',
              description: 'Development server'
            },
          ],
        }
    });
})

