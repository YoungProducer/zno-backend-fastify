/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * Subject controller which handles api requests.
 */

/** External imports */
import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { ServerResponse, IncomingMessage } from 'http';

/** Application's imports */

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

        fastify.post('/create', async (
            req: FastifyRequest<IncomingMessage>,
            reply: FastifyReply<ServerResponse>,
        ) => await createHandler(fastify, req, reply));

    });
    fastify.get('/subjects', async (
        req: FastifyRequest<IncomingMessage>,
        reply: FastifyReply<ServerResponse>,
    ) => await subjectsHandler(fastify, req, reply));
};

const createHandler = async (
    fastify: FastifyInstance,
    req: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
) => {
    /** Extract data from request body */
    const name = req.body.name;

    try {
        const subject = await fastify.subjectService.create(name);

        return subject;
    } catch (err) {
        reply.send(err);
    }
};

const subjectsHandler = async (
    fastify: FastifyInstance,
    req: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
) => {
    try {
        const subjects = await fastify.subjectService.subjects();

        return subjects;
    } catch (err) {
        reply.send(err);
    }
};
