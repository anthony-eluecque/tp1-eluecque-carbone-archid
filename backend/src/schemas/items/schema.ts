export const getItemById = {
    tags: ['Items'],
    description: 'Get an item by id',
    response: {
        200: {
            description: 'Successful response',
            $ref: 'TodoItemResponse'
        }
    }
}

export const assignUserToItem = {
    tags: ['Items'],
    description: 'Assign an user to an item',
    response: {
        200: {
            description: 'Successful response',
            $ref: 'TodoItemResponse'
        }
    }
}
