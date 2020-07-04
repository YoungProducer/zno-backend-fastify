/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * Service which handles authentication of administrators
 * to admin panel.
 */

/** External imports */
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { IncomingMessage, ServerResponse } from 'http';

/** Application's imports */
import { AdminAuth } from './types';
import { signin, me } from './schema';
import { errorHandler } from '../services/error-handler';

export = async function (
    fastify: FastifyInstance,
    opts: any,
) {
    fastify.post('/signin', { schema: signin }, async (
        req: FastifyRequest<IncomingMessage>,
        reply: FastifyReply<ServerResponse>,
    ) => await signinHandler(
        fastify,
        req,
        reply,
    ));

    fastify.post('/logout', async (
        req: FastifyRequest<IncomingMessage>,
        reply: FastifyReply<ServerResponse>,
    ) => await logoutHandler(
        fastify,
        req,
        reply,
    ));

    fastify.register(async (fastify) => {
        fastify.addHook('preHandler', async (
            req: FastifyRequest<IncomingMessage>,
            reply: FastifyReply<ServerResponse>,
        ) => {
            await fastify.adminAuthPreHandler(req, reply);
            return;
        });

        fastify.get('/me', { schema: me }, async (
            req: FastifyRequest<IncomingMessage>,
            reply: FastifyReply<ServerResponse>,
        ) => await meHandler(
            fastify,
            req,
            reply,
        ));
    });
};

const signinHandler: AdminAuth.Handlers.SigninHandler = async (
    fastify,
    req,
    reply,
) => {
    try {
        const userCredentials = req.body;

        const user = await fastify.adminAuthService.signin(
            userCredentials,
            reply,
        );

        reply.send(user);
    } catch (err) {
        const error = errorHandler(err, req);
        reply.send(error);
    }
};

const meHandler: AdminAuth.Handlers.SigninHandler = async (
    fastify,
    req,
    reply,
) => {
    try {
        const userProfile = await fastify.adminAuthService.me(req);

        reply.send(userProfile);
    } catch (err) {
        const error = errorHandler(err, req);
        reply.send(error);
    }
};

const logoutHandler: AdminAuth.Handlers.LogoutHandler = async (
    fastify,
    req,
    reply,
) => {
    try {
        await fastify.adminAuthService.logout(req, reply);

        reply.code(204).send();
    } catch (err) {
        reply.send(err);
    }
};
