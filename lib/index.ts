// Import reflect metadata for dependency injection mechanism
import 'reflect-metadata';

/** External imports */
import fastify, { FastifyInstance, FastifyRequest, FastifyReply, SchemaCompiler } from 'fastify';
import fp from 'fastify-plugin';
import fastifyFormBody from 'fastify-formbody';
import fastifyCors from 'fastify-cors';
import jwt from 'fastify-jwt';
import fastifyCookie from 'fastify-cookie';
import { IncomingMessage, ServerResponse } from 'http';

/** Application's imports */
import BcryptHasher from './services/bcrypt-hasher';
import ValidatorService from './services/validator';
import AccessService from './services/access-service';
import RefreshService from './services/refresh-service';
import UserService from './services/user-service';

import jwtAccess from './plugins/jwtAccess';

import authController from './auth';

/** Import env config */
require('dotenv').config();

const schema = {
    type: 'object',
    required: [
        'JWT_SECRET',
        'JWT_ACCESS_EXPIRES_IN',
        'JWT_ACCESS_COOKIES_MAX_AGE',
        'JWT_REFRESH_EXPIRES_IN',
        'JWT_REFRESH_COOKIES_MAX_AGE',
    ],
    properties: {
        JWT_ACCESS_SECRET: { type: 'string' },
        JWT_ACCESS_EXPIRES_IN: { type: 'string' },
        JWT_ACCESS_COOKIES_MAX_AGE: { type: 'string' },
        JWT_REFRESH_SECRET: { type: 'string' },
        JWT_REFRESH_EXPIRES_IN: { type: 'string' },
        JWT_REFRESH_COOKIES_MAX_AGE: { type: 'string' },
    },
};

const decorateFastifyInstance = async (fastify: FastifyInstance) => {
    const bcryptHasher = new BcryptHasher();
    fastify.decorate('bcryptHasher', bcryptHasher);

    const validatorService = new ValidatorService();
    fastify.decorate('validatorService', validatorService);

    const userService = new UserService(fastify);
    fastify.decorate('userService', userService);

    const accessService = new AccessService(fastify);
    fastify.decorate('accessService', accessService);

    const refreshService = new RefreshService(fastify);
    fastify.decorate('refreshService', refreshService);

    fastify.decorate('authPreHandler', async (
        req: FastifyRequest<IncomingMessage>,
        reply: FastifyReply<ServerResponse>,
    ) => {
        fastify.log.debug('auth');
        try {
            /** Extract token from cookie */
            const token = req.cookies['accessToken'];

            /** Verify token */
            const user = await fastify.accessService.verifyToken(token);

            /** Set user data to req body */
            req.body.user = user;
        } catch (err) {
            reply.send(err);
        }
    });
};

const authenticator = async (fastify: FastifyInstance) => {
    const secret: string = process.env.JWT_SECRET || 'supersecret';
    fastify
        .register(jwt, {
            secret,
        });
};

const instance = fastify();

instance
    .register(fastifyCors, {
        origin: ['http://localhost:3000', 'http://localhost:8080'],
        credentials: true,
    })
    .register(require('fastify-env'), { schema })
    .register(fp(authenticator))
    .register(fp(decorateFastifyInstance))
    .register(fastifyFormBody)
    .register(fastifyCookie)
    .register(authController, { prefix: '/auth/user' });

export { instance };
