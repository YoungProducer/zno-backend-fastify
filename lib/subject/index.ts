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

        fastify.post('subject', async (
            req: FastifyRequest<IncomingMessage>,
            reply: FastifyReply<ServerResponse>,
        ) => await createHandler(fastify, req, reply));

        fastify.patch('subject/image', async (
            req: FastifyRequest<IncomingMessage>,
            reply: FastifyReply<ServerResponse>,
        ) => await updateSubjectImageHandler(fastify, req, reply));

        fastify.delete('subject/image', async (
            req: FastifyRequest<IncomingMessage>,
            reply: FastifyReply<ServerResponse>,
        ) => await deleteSubjectImageHandler(fastify, req, reply));
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
    const subSubjects: string = req.query.subSubjects;

    try {
        const subjects = await fastify.subjectService.subjects(Boolean(subSubjects) && subSubjects === 'true');

        return subjects;
    } catch (err) {
        reply.send(err);
    }
};

const updateSubjectImageHandler = async (
    fastify: FastifyInstance,
    req: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
) => {
    /** Extract data from req body */
    const { id, image } = req.body;

    try {
        const subject = await fastify.subjectService.uploadImage(id, image);

        return { subject };
    } catch (err) {
        reply.send(err);
    }
};

const deleteSubjectImageHandler = async (
    fastify: FastifyInstance,
    req: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
) => {
    /** Extract data from req body */
    const { id, image } = req.body;

    try {
        /** Check is subject have image */
        const exists = await fastify.subjectService.checkIsSubjectHaveImage(id);

        if (exists) {
            const subject = await fastify.subjectService.deleteImage(exists, id);
            return { subject };
        }

        return `Subject doesn't have an image`;
    } catch (err) {
        reply.send(err);
    }
};
