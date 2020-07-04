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
import { create } from './schema';

export = async function (
    fastify: FastifyInstance,
    opts: any,
) {
    fastify.register(async (fastify: FastifyInstance) => {
        fastify.addHook('preHandler', async (
            req: FastifyRequest<IncomingMessage>,
            reply: FastifyReply<ServerResponse>,
        ) => {
            await fastify.adminAuthPreHandler(req, reply);
            return;
        });

        fastify.post('subject', { schema: create }, async (
            req: FastifyRequest<IncomingMessage>,
            reply: FastifyReply<ServerResponse>,
        ) => await createHandler(fastify, req, reply));
    });

    fastify.get('subject', async (
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
    const credentials = req.body;

    try {
        const subject = await fastify.subjectService.create(credentials);

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
    const subSubject: string = req.query.subSubject;

    try {
        const subjects = await fastify.subjectService.subjects(Boolean(subSubject) && subSubject === 'true');

        return subjects;
    } catch (err) {
        reply.send(err);
    }
};
