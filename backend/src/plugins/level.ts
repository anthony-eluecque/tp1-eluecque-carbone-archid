import fp from "fastify-plugin";
import level, { FastifyLeveldbOptions } from '@fastify/leveldb';

export default fp<FastifyLeveldbOptions>(async (fastify, opts) => {
    fastify.register(level, {
        name: 'lists',
        path: "./db/lists",
    } );

    fastify.register(level, {
        name: 'users',
        path: "./db/users",
    } );
});