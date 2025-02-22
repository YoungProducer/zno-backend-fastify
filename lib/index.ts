// Import reflect metadata for dependency injection mechanism
import 'reflect-metadata';

/** External imports */
import fs from 'fs';
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
import mongoose from 'mongoose';

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
import { authPreHandler } from './plugins/auth-pre-handler';
import { adminAuthPreHandler } from './plugins/admin-auth-pre-handler';
import { userModel } from './models/user';

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
        'MONGO_URI',
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
        CURRENT_ENDPOINT: { type: 'string' },
        PORT: { type: 'string', default: '4000' },
        HOST: { type: 'string', default: 'localhost' },
        PROTOCOL: { type: 'string', default: 'http' },
        MONGO_URI: { type: 'string' },
    },
};

const connectToDatabase = async (fastify: FastifyInstance) => {
    const {
        MONGO_URI,
    } = fastify.config;
    // const mongouri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@mycluster-qntjt.azure.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority`;
    const mongouri = MONGO_URI;

    const connection = await mongoose.connect(mongouri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

const disconnectFromDatabase = async () => {
    await mongoose.disconnect();
};

const decorateFastifyInstance = async (fastify: FastifyInstance) => {
    fastify.addHook('onClose', async (instance: FastifyInstance, done: () => void) => {
        await disconnectFromDatabase();

        done();
    });

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
    ) => await authPreHandler(fastify, req, reply));

    fastify.decorate('adminAuthPreHandler', async (
        req: FastifyRequest<IncomingMessage>,
        reply: FastifyReply<ServerResponse>,
    ) => await adminAuthPreHandler(fastify, req, reply));
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

const clientEnpoint =
    separateURL(process.env.CLIENT_ENDPOINT || 'http://localhost:8080');
const clientMobileEndpoint =
    separateURL(process.env.CLIENT_MOBILE_ENDPOINT || 'http://localhost:8081');
const adminEndpoint =
    separateURL(process.env.ADMIN_ENDPOINT || 'http://localhost:8082');

const uploadsPath = !development
    ? '../../uploads'
    : '../uploads';

instance
    .register(fastifyCors, {
        origin: [
            clientEnpoint.origin,
            clientMobileEndpoint.origin,
            adminEndpoint.origin,
        ],
        credentials: true,
    })
    .register(fastifyStatic, {
        root: path.join(__dirname, uploadsPath),
        prefix: '/uploads/',
    })
    .register(require('fastify-env'), { schema })
    .register(fp(connectToDatabase))
    .register(fp(errorHandler))
    .register(fp(authenticator))
    .register(fp(decorateFastifyInstance))
    .register(fastifyFormBody)
    .register(fastifyCookie)
    .register(require('fastify-file-upload'), {
        limits: {
            fileSize: 200 * 1024 * 1024,
        },
    })
    .register(authController, { prefix: 'api/auth/' })
    .register(adminAuthController, { prefix: 'api/auth/admin' })
    .register(subjectController, { prefix: 'api/' })
    .register(subjectConfigController, { prefix: 'api/' })
    .register(testSuiteController, { prefix: 'api/' });

export { instance };
