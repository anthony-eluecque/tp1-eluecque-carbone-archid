import {FastifyInstance} from "fastify";
import {User} from "../../types";

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

export default class UsersRepository {

    constructor(private db : FastifyInstance) {}

    getUserById = async (id : string) : Promise<RepositoryResult<User>> => {
        try {
            const user = await this.db.level.users.get(id);
            return {
                success: true,
                data: JSON.parse(user),
                message: `User fetched`
            };

        } catch (error) {
            if (isLevelDBError(error) && error.notFound) {
                return {
                    success: false,
                    error: `User with id ${id} not found`
                };
            }
            throw new Error(`Error fetching user with id ${id}`)
        }
    }

    createUser = async(user : User) : Promise<RepositoryResult<null>> => {

        const userResult = await this.getUserById(user.id);

        if (userResult.success) {
            return { success: false, error: "User with this id is existing" };
        }

        await this.db.level.users.put(user.id, JSON.stringify(user));
        return { success: true, message: "User successfully created" };
    }

};