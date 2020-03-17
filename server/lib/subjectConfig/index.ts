/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 11 March 2020
 *
 * Subject config controller to handle all actions with subject config.
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ServerResponse, IncomingMessage } from 'http';

export = async function (
    fastify: FastifyInstance,
    opts: any,
) {
    fastify.register(async (fastify: FastifyInstance) => {
        fastify.addHook('preHandler', async (
            req: FastifyRequest<IncomingMessage>,
            reply: FastifyReply<ServerResponse>,
        ) => {
            await fastify.authPreHandler(req, reply);
            return;
        });

        fastify.get('/config/:subject', async (
            req: FastifyRequest<IncomingMessage>,
            reply: FastifyReply<ServerResponse>,
        ) => await configHandler(fastify, req, reply));
    });
};

const createConfigHandler = (
    req: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
) => {

};

const configHandler = async (
    fastify: FastifyInstance,
    req: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
) => {
    const id = req.params.subject;

    try {
        const config = await fastify.subjectConfigService.config(id);

        reply.send(config);
    } catch (err) {
        reply.send(err);
    }
};
