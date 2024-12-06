export const getLists = {
    tags: ['Lists'],
    description: 'Get all lists',
    response: {
        200: {
            description: 'Successful response',
            type: 'array',
            items: {
                $ref: 'TodoList#'
            }
        }
    }
}