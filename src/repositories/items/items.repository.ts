import {FastifyInstance} from "fastify";
import {TodoItem, TodoList} from "../../types";

interface LevelDBError extends Error {
    notFound?: boolean;
}

const isLevelDBError = (error: unknown): error is LevelDBError => {
    return typeof error === 'object' && error !== null && 'notFound' in error;
}

interface RepositoryResult<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string
}

export default class ItemsRepository {

    constructor(private db : FastifyInstance) {}

    getItemById = async (id : string) : Promise<RepositoryResult<TodoItem>> => {
        try {
            const lists = await this.db.level.lists.iterator();
            const result: TodoList[] = new Array<TodoList>();

            // @ts-ignore
            for await(const [_, value] of lists) {
                result.push(JSON.parse(value));
            }
            for (const todoList of result) {
                for (const item of todoList.items) {
                    if (item.id == id)
                        return {
                            success: true,
                            data: item,
                            message: "Item fetched"
                        };
                }
            }

            return {
                success: false,
                error: `Item with this id ${id} not found`
            };

        } catch (error) {
            if (isLevelDBError(error) && error.notFound) {
                return { 
                    success: false, 
                    error: `Item with id ${id} not found`
                };
            }
            throw new Error(`Error fetching item with id ${id}`)
        }  
    }

    updateItem = async (id : string, todoItem : TodoItem) : Promise<void> => {
        const lists = this.db.level.lists.iterator()
        const result: TodoList[] = new Array<TodoList>();

        // @ts-ignore
        for await(const [_, value] of lists){
            result.push(JSON.parse(value));
        }

        console.log('---------------------------------')
        console.log(result);
        console.log(result[0].items);

        for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < result[i].items.length; j++) {
                // @ts-ignore
                if (result[i].items[j].id == id) {
                    // @ts-ignore
                    result[i].items[j] = todoItem;
                }
            }
            await this.db.level.lists.put(result[i].id, JSON.stringify(result[i]));
        }
    }


};