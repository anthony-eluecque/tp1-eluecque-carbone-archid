import { FastifyReply } from "fastify";

export default class Res {
    static send = (reply : FastifyReply, statusCode: number, message: string, data? : any) => {
        data ? reply.code(statusCode).send({
            message : message, 
            data: data
        }) : reply.code(statusCode).send({ message: message });
    }

    static error = (reply : FastifyReply, statusCode: number, message: string, error: any) => {
        reply.code(statusCode).send({
            message: message,
            error: error
        });
    }
}