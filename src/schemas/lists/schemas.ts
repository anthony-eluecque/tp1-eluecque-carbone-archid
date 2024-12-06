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

export const createList = {
    tags: ['Lists'],
    description: 'Create a new list',
    body: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'The id of the list'
            },
            name: {
                type: 'string',
                description: 'The name of the list'
            },
            description: {
                type: 'string',
                description: 'The description of the list' 
            }
        }
    },
    response: {
        201: {
            description: 'List created',
            $ref: 'TodoListResponse'
        },
        409: {
            description: 'List already exists',
            $ref: 'ConflictResponse'
        }
    }
}

export const updateList = {
    tags: ['Lists'],
    description: 'Update a list',
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'The id of the list'
            }
        }
    },
    body: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                description: 'The new name of the list'
            },
            description: {
                type: 'string',
                description: 'The new description of the list'
            }
        }
    },
    response: {
        200: {
            description: 'List updated',
            $ref: 'TodoListResponse'
        },
        404: {
            description: 'List not found',
            $ref: 'NotFoundResponse'
        }
    }
}

export const getItemsInList = {
    tags: ['Lists'],
    description: 'Get all items in a list',
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
            description: 'Items fetched',
            $ref: 'TodoItemsResponse'
        },
        404: {
            description: 'List not found',
            $ref: 'NotFoundResponse'
        }
    }
}

export const createItemInList = {
    tags: ['Lists'],
    description: 'Create an item in a list',
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'The id of the list'
            }
        }
    },
    body: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'The id of the item'
            },
            state: {
                $ref: 'State',
                description: 'The state of the item'
            },
            description: {
                type: 'string',
                description: 'The description of the item'
            },
            assignedTo: {
                type: 'array',
                description: 'Users assigned to the item',
                items : {
                    type: 'string',
                    description: 'The id of the user'
                }
            }
        }
    },
    response: {
        201: {
            description: 'Item created',
            $ref: 'TodoListResponse'
        },
        409: {
            description: 'Item already exists',
            $ref: 'ConflictResponse'
        }
    }
}


export const deleteItemInList = {
    tags: ['Lists'],
    description: 'Delete an item in a list',
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'The id of the list'
            },
            itemId: {
                type: 'string',
                description: 'The id of the item'
            }
        }
    },
    response: {
        204: {
            description: 'Item deleted',
            $ref: 'NoContentResponse'
        },
        404: {
            description: 'Item not found',
            $ref: 'NotFoundResponse'
        }
    }
}

export const updateItemInList = {
    tags: ['Lists'],
    description: 'Update an item in a list',
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'The id of the list'
            },
            itemId: {
                type: 'string',
                description: 'The id of the item'
            }
        }
    },
    body: {
        type: 'object',
        properties: {
            state: {
                $ref: 'State',
                description: 'The state of the item'
            },
            description: {
                type: 'string',
                description: 'The description of the item'
            },
        }
    },
    response: {
        200: {
            description: 'Item updated',
            $ref: 'TodoListResponse'
        },
        404: {
            description: 'Item not found',
            $ref: 'NotFoundResponse'
        },
        409: {
            description: 'Conflicts - invalid state',
            $ref: 'ConflictResponse'
        }
    }
}


export const changeListState = {
    tags: ['Lists'],
    description: 'Change the state of a list',
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'The id of the list'
            },
            state: {
                $ref: 'State',
                description: 'The new state of the list'
            }
        }
    },
    response: {
        204: {
            description: 'List state changed',
            $ref: 'NoContentResponse'
        },
        400: {
            description: 'Invalid state',
            $ref: 'BadRequest'
        },
        404: {
            description: 'List not found',
            $ref: 'NotFoundResponse'
        }
    }
}
