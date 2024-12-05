import {Res} from '../../helpers';
import {UsersRepository} from '../../repositories';
import {HttpStatusCode, ListParams, User} from '../../types';
import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';

export class UsersController {

    private readonly _repository: UsersRepository;

    constructor(server: FastifyInstance) {
        this._repository = new UsersRepository(server);
    }

    async getUserById(request: FastifyRequest<ListParams>, reply: FastifyReply) {
        try {
            const {id} = request.params;
            const result = await this._repository.getUserById(id);

            if (!result.success) {
                Res.send(reply, HttpStatusCode.NOT_FOUND, result.error!)
            }
            Res.send(reply, HttpStatusCode.OK, result.message!, result.data);
        } catch (error) {
            Res.error(reply, HttpStatusCode.INTERNAL_SERVER_ERROR, "Error while fetching user", error);
        }
    }

    async createUser(request: FastifyRequest<ListParams>, reply: FastifyReply) {
        try {
            const newUser : User = request.body as User;
            const result = await this._repository.createUser(newUser);

            if (!result.success) {
                Res.send(reply, HttpStatusCode.CONFLICT, result.error!)
            }

            Res.send(reply, HttpStatusCode.CREATED, result.message!, newUser)
        } catch (error) {
            Res.error(reply, HttpStatusCode.INTERNAL_SERVER_ERROR, "Error while creating user", error);
        }

    }


}
