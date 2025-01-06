export const getUserById = {
    tags: ['Users'],
    description: 'Get an user by id',
    response: {
        200: {
            description: 'Successful response',
            $ref: 'UserResponse'
        }
    }
}

export const createUser = {
    tags: ['Users'],
    description: 'Create a new user',
    body: {
        type : 'object',
        properties: {
            id : {
                type : 'string',
                description: 'Id of the user'
            },
            name : {
                type : 'string',
                description: 'Name of the user'
            }
        }
    },
    response: {
        200: {
            description: 'Successful response',
            $ref: 'UserResponse'
        },
        409: {
            description: 'User conflict',
            $ref: 'ConflictResponse'
        }
    }
}
