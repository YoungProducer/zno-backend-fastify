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
import aws from 'aws-sdk';

/** Application's imports */
import BcryptHasher from './services/bcrypt-hasher';
import ValidatorService from './services/validator';
import AccessService from './services/access-service';
import RefreshService from './services/refresh-service';
import UserService from './services/user-service';

import jwtAccess from './plugins/jwtAccess';

import authController from './auth';
import subjectController from './subject';
import subjectConfigController from './subjectConfig';
import AuthService from './auth/service';
import SubjectService from './subject/service';
import SubjectConfigService from './subjectConfig/service';

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
        'S3_BUCKET',
    ],
    properties: {
        JWT_SECRET: { type: 'string' },
        JWT_ACCESS_EXPIRES_IN: { type: 'string' },
        JWT_ACCESS_COOKIES_MAX_AGE: { type: 'string' },
        JWT_REFRESH_EXPIRES_IN: { type: 'string' },
        JWT_REFRESH_COOKIES_MAX_AGE: { type: 'string' },
        JWT_SESSION_EXPIRES_IN: { type: 'string' },
        S3_BUCKET: { type: 'string' },
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

                /** Set profile to req body */
                req.params.userProfile = _.omit(userProfile, 'hash');

                /** Set new tokens pair to cookies */
                reply
                    .setCookie('accessToken', newAccessToken, {
                        maxAge: Number(fastify.config.JWT_ACCESS_COOKIES_MAX_AGE),
                        httpOnly: true,
                        path: '/',
                    })
                    .setCookie('refreshToken', newRefreshToken, {
                        maxAge: Number(fastify.config.JWT_REFRESH_COOKIES_MAX_AGE),
                        httpOnly: true,
                        path: '/',
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
                    data: req.body.error,
                });
        } else {
            reply.send(error);
        }
    });
};

const instance = fastify();

const mode = process.env.NODE_ENV || 'production';

const clientPath = mode === 'development'
    ? '../../client/public'
    : '../../../client/build';

instance
    .register(fastifyCors, {
        origin: ['http://localhost:3000', 'http://localhost:8080', 'https://zno-client.herokuapp.com'],
        credentials: true,
    })
    .register(require('fastify-env'), { schema })
    .register(fp(errorHandler))
    .register(fp(authenticator))
    .register(fp(decorateFastifyInstance))
    .register(fastifyFormBody)
    .register(fastifyCookie)
    // .register((instance, opts, next) => {
    //     instance.register(require('fastify-static'), {
    //         root: path.join(__dirname, clientPath),
    //         prefix: '/',
    //     });

    //     // instance.get('/', async (req: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => {
    //     //     // reply.sendFile(path.join(__dirname, `${clientPath}/index.html`));
    //     //     reply.sendFile(path.resolve(__dirname, clientPath, ));
    //     // });

    //     next();
    // })
    // .register(require('fastify-static'), {
    //     root: path.join(__dirname, '../public/'),
    //     prefix: '/public/',
    // })
    .get('/file/*', async (req, reply) => {
        const fileName: string = req.params['*'];

        console.log(req.params);

        const s3 = new aws.S3({
            accessKeyId: 'AKIAIGBFC5KT3KI5QLCQ',
            secretAccessKey: '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',
            signatureVersion: 'v4',
            region: 'eu-central-1',
        });

        const params = {
            Bucket: 'zno-train',
            Key: fileName,
            Expires: 60,
        };

        try {
            const data = await s3.getSignedUrlPromise('getObject', params)
            
            const returnData = {
                signedRequest: data,
                url: `https://zno-train.s3.amazonaws.com/${fileName}`,
            };

            reply.send(returnData);
        } catch (err) {
            reply.send(err);
        }
    })
    .register(authController, { prefix: 'api/auth/user' })
    .register(subjectController, { prefix: 'api/subject' })
    .register(subjectConfigController, { prefix: 'api/subject-config' });

export { instance };
