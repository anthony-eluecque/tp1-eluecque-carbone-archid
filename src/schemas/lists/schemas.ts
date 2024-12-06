export const getLists = {
    tags: ['Lists'],
    description: 'Get all lists',
    response: {
        200: {
            description: 'Successful response',
            $ref: 'TodoListsResponse'
        }
    }
}

export const getListById = {
    tags: ['Lists'],
    description: 'Get a list by id',
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'The id of the list'
            }
        }
    },
    response: {
        200: {
            description: 'Successful response',
            $ref: 'TodoListResponse'
        },
        404: {
            description: 'List not found',
            $ref: 'NotFoundResponse'
        }
    }
}