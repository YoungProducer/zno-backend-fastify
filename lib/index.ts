// Import reflect metadata for dependency injection mechanism
import 'reflect-metadata';

/** External imports */
import path from 'path';
import fastify, { FastifyInstance, FastifyRequest, FastifyReply, SchemaCompiler } from 'fastify';
import fp from 'fastify-plugin';
import fastifyFormBody from 'fastify-formbody';
import fastifyCors from 'fastify-cors';
import jwt from 'fastify-jwt';
import fastifyCookie from 'fastify-cookie';
import fastifyStatic from 'fastify-static';
import { IncomingMessage, ServerResponse } from 'http';
import _ from 'lodash';

/** Application's imports */
import BcryptHasher from './services/bcrypt-hasher';
import ValidatorService from './services/validator';
import AccessService from './services/access-service';
import RefreshService from './services/refresh-service';
import UserService from './services/user-service';

import authController from './auth';
import subjectController from './subject';
import subjectConfigController from './subjectConfig';
import testSuiteController from './testSuite';
import adminAuthController from './admin-auth';
import AuthService from './auth/service';
import SubjectService from './subject/service';
import SubjectConfigService from './subjectConfig/service';
import TestSuiteService from './testSuite/service';
import AdminAuthService from './admin-auth/service';
import { separateURL } from './utils/separateURL';

/** Import env config */
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const schema = {
    type: 'object',
    required: [
        'JWT_SECRET',
        'JWT_ACCESS_EXPIRES_IN',
        'JWT_ACCESS_COOKIES_MAX_AGE',
        'JWT_REFRESH_EXPIRES_IN',
        'JWT_REFRESH_COOKIES_MAX_AGE',
        'JWT_SESSION_EXPIRES_IN',
        // 'CLIENT_ENDPOINT',
    ],
    properties: {
        JWT_SECRET: { type: 'string' },
        JWT_ACCESS_EXPIRES_IN: { type: 'string' },
        JWT_ACCESS_COOKIES_MAX_AGE: { type: 'string' },
        JWT_REFRESH_EXPIRES_IN: { type: 'string' },
        JWT_REFRESH_COOKIES_MAX_AGE: { type: 'string' },
        JWT_SESSION_EXPIRES_IN: { type: 'string' },
        CLIENT_ENDPOINT: { type: 'string', default: 'http://localhost:8080' },
        CLIENT_MOBILE_ENDPOINT: { type: 'string', default: 'http://localhost:8081' },
        ADMIN_ENDPOINT: { type: 'string', default: 'http://localhost:8082' },
        PORT: { type: 'string', default: '4000' },
        HOST: { type: 'string', default: 'localhost' },
        PROTOCOL: { type: 'string', default: 'http' },
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

    const authService = new AuthService(fastify);
    fastify.decorate('authService', authService);

    const subjectService = new SubjectService(fastify);
    fastify.decorate('subjectService', subjectService);

    const subjectConfigService = new SubjectConfigService();
    fastify.decorate('subjectConfigService', subjectConfigService);

    const testSuiteService = new TestSuiteService(fastify);
    fastify.decorate('testSuiteService', testSuiteService);

    const adminAuthService = new AdminAuthService(fastify);
    fastify.decorate('adminAuthService', adminAuthService);

    fastify.decorate('authPreHandler', async (
        req: FastifyRequest<IncomingMessage>,
        reply: FastifyReply<ServerResponse>,
    ) => {
        try {
            /** Extract access token from cookies */
            const accessToken = req.cookies['accessToken'];

            /** Verify token */
            const userProfile = await fastify.accessService.verifyToken(accessToken);

            /** Set user data to req body */
            req.params.userProfile = userProfile;
        } catch (err) {
            try {
                /** Extract refresh token from cookies */
                const refreshToken = req.cookies['refreshToken'];

                /** Verify token */
                const userProfile = await fastify.refreshService.verifyToken(refreshToken);

                /** Generate new tokens */
                const newAccessToken = await fastify.accessService.generateToken(_.omit(userProfile, 'hash'));
                const newRefreshToken = await fastify.refreshService.generateToken(userProfile);

                const url =
                    userProfile.role === 'ADMIN'
                        ? separateURL(fastify.config.ADMIN_ENDPOINT)
                        : separateURL(fastify.config.CLIENT_ENDPOINT);

                /** Set profile to req body */
                req.params.userProfile = _.omit(userProfile, 'hash');

                /** Set new tokens pair to cookies */
                reply
                    .setCookie('accessToken', newAccessToken, {
                        maxAge: Number(fastify.config.JWT_ACCESS_COOKIES_MAX_AGE),
                        httpOnly: true,
                        path: url?.pathname,
                        domain: url?.hostname,
                    })
                    .setCookie('refreshToken', newRefreshToken, {
                        maxAge: Number(fastify.config.JWT_REFRESH_COOKIES_MAX_AGE),
                        httpOnly: true,
                        path: url?.pathname,
                        domain: url?.hostname,
                    });
            } catch (err) {
                reply.send(err);
            }
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

const errorHandler = async (fastify: FastifyInstance) => {
    fastify.setErrorHandler((error, req, reply) => {
        if (error.statusCode) {
            reply
                .code(error.statusCode)
                .send({
                    statusCode: error.statusCode,
                    message: error.message,
                    errors: req.body && req.body.error ? req.body.error : undefined,
                });
        } else {
            reply.send(error);
        }
    });
};

const instance = fastify();

const production = process.env.NODE_ENV === 'production';
const development = process.env.NODE_ENV === 'development';

const clientEnpoint = process.env.CLIENT_ENDPOINT || 'http://localhost:8080';
const clientMobileEndpoint = process.env.CLIENT_MOBILE_ENDPOINT || 'http://localhost:8081';
const adminEndpoint = process.env.ADMIN_ENDPOINT || 'http://localhost:8082';

const uploadsPath = !development
    ? '../../uploads'
    : '../uploads';

instance
    .register(fastifyCors, {
        origin: [
            clientEnpoint,
            clientMobileEndpoint,
            adminEndpoint,
        ],
        credentials: true,
    })
    .register(fastifyStatic, {
        root: path.join(__dirname, uploadsPath),
        prefix: '/uploads/',
    })
    .register(require('fastify-env'), { schema })
    .register(fp(errorHandler))
    .register(fp(authenticator))
    .register(fp(decorateFastifyInstance))
    .register(fastifyFormBody)
    .register(fastifyCookie)
    .register(require('fastify-file-upload'))
    .register(authController, { prefix: 'api/auth/' })
    .register(adminAuthController, { prefix: 'api/auth/admin' })
    .register(subjectController, { prefix: 'api/' })
    .register(subjectConfigController, { prefix: 'api/' })
    .register(testSuiteController, { prefix: 'api/' });

export { instance };
