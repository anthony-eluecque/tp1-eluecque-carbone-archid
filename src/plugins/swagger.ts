import fp from 'fastify-plugin'
import swagger, { FastifySwaggerOptions } from '@fastify/swagger'
import JsonSchemas from '../schemas/all.json'

export default fp<FastifySwaggerOptions>(async (fastify) => {
  fastify.addSchema({
    "$id": "TodoList",
    ...JsonSchemas.definitions.TodoList,    
  })

  fastify.addSchema({
    "$id": "TodoItem",
    ...JsonSchemas.definitions.TodoItem,
  })

  fastify.addSchema({
    "$id": "State",
    ...JsonSchemas.definitions.State,
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
  })
})

