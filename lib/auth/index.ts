/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 8 March 2020
 *
 */

/** External imports */
import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { IncomingMessage, ServerResponse } from "http";

/** Application's imports */
import { prisma, User } from '../../prisma/generated/prisma-client';
import { ISignUpCredentials, ISignInCredentials, UserProfile } from "../services/types";
import { errorHandler } from '../services/error-handler';
import { separateURL } from '../utils/separateURL';
import { IRefreshReturnData } from "./types";
import {
    me,
    signin,
    signup,
} from './schema';
import { userModel, UserSchema } from "../models/user";

export = async function (
    fastify: FastifyInstance,
    opts: any,
) {
    fastify.post('/signup', { schema: signup }, async (
        req: FastifyRequest<IncomingMessage>,
        reply: FastifyReply<ServerResponse>,
    ) => await signupHandler(
        fastify,
        req,
        reply,
    ));
    fastify.post('/signin', { schema: signin }, async (
        req: FastifyRequest<IncomingMessage>,
        reply: FastifyReply<ServerResponse>,
    ) => await signinHandler(
        fastify,
        req,
        reply,
    ));
    fastify.get('/refresh', async (
        req: FastifyRequest<IncomingMessage>,
        reply: FastifyReply<ServerResponse>,
    ) => await refreshHandler(
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

    fastify.register(async (fastify: FastifyInstance) => {
        fastify.addHook('preHandler', async (
            req: FastifyRequest<IncomingMessage>,
            reply: FastifyReply<ServerResponse>,
        ) => {
            await fastify.authPreHandler(req, reply);
            return;
        });
        fastify.get('/me', { schema: me }, meHandler);
    });
};

async function signupHandler(
    fastify: FastifyInstance,
    req: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
) {
    const credentials: ISignUpCredentials = req.body;

    try {
        /** Validate credentials */
        await fastify.validatorService.validateSignUpCredentials(credentials);

        /** Hash password */
        credentials.password = await fastify.bcryptHasher.hashPassword(credentials.password);

        /** Get created user */
        const user = await userModel.create(credentials);

        return { ...user.toClient() };
    } catch (err) {
        console.log(err);
        if (err.result) {
            if (err.result.errors[0].code === 3010) {
                reply.status(400).send({
                    message: 'Користувач з таким емейлом уже зареєстрований!',
                    errors: {
                        errorFields: ['email'],
                        errorMessages: {
                            email: 'Користувач з таким емейлом уже зареєстрований!',
                        },
                    },
                });

                return;
            }
        }
        const error = errorHandler(err, req);
        /** Set additional data to req body to prevent getting the 500 error */
        reply.send(error);
    }
}

async function signinHandler(
    fastify: FastifyInstance,
    req: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
) {
    /** Extract credentials */
    const credentials: ISignInCredentials = req.body;

    try {
        const user = await fastify.userService.verifyCredentials(credentials);

        const userProfile: UserProfile = fastify.userService.convertToUserProfile(user);

        const accessToken: string = await fastify.accessService.generateToken(userProfile);

        const refreshToken: string = await fastify.refreshService.generateToken(userProfile);

        const clientEndpoint = separateURL(fastify.config.CLIENT_ENDPOINT);

        if (!user.emailConfirmed) {
            reply.setCookie('emailConfirmed', 'false', {
                maxAge: credentials.remember
                    ? Number(fastify.config.JWT_REFRESH_COOKIES_MAX_AGE)
                    : undefined,
                httpOnly: false,
                path: clientEndpoint ? clientEndpoint.pathname : '/',
                domain: clientEndpoint ? clientEndpoint.hostname : undefined,
            });
        }

        console.log(clientEndpoint);

        reply
            .setCookie('accessToken', accessToken, {
                maxAge: credentials.remember
                    ? Number(fastify.config.JWT_ACCESS_COOKIES_MAX_AGE)
                    : undefined,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: clientEndpoint ? clientEndpoint.pathname : '/',
                domain: clientEndpoint ? clientEndpoint.hostname : undefined,
            })
            .setCookie('refreshToken', refreshToken, {
                maxAge: credentials.remember
                    ? Number(fastify.config.JWT_REFRESH_COOKIES_MAX_AGE)
                    : undefined,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: clientEndpoint ? clientEndpoint.pathname : '/',
                domain: clientEndpoint ? clientEndpoint.hostname : undefined,
            })
            .send(user);
    } catch (err) {
        const error = errorHandler(err, req);
        reply.send(error);
    }
}

async function meHandler(
    req: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
) {
    try {
        const user = req.params.userProfile;

        return { ...user };
    } catch (err) {
        const error = errorHandler(err, req);
        reply.send(error);
    }
}

async function refreshHandler(
    fastify: FastifyInstance,
    req: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
) {
    try {
        const { accessToken, refreshToken, userProfile }: IRefreshReturnData = await fastify.authService.refresh(req);

        const clientEndpoint = separateURL(fastify.config.CLIENT_ENDPOINT);

        reply
            .setCookie('accessToken', accessToken, {
                maxAge: Number(fastify.config.JWT_ACCESS_COOKIES_MAX_AGE),
                httpOnly: true,
                path: clientEndpoint ? clientEndpoint.pathname : '/',
                domain: clientEndpoint ? clientEndpoint.hostname : undefined,
            })
            .setCookie('refreshToken', refreshToken, {
                maxAge: Number(fastify.config.JWT_REFRESH_COOKIES_MAX_AGE),
                httpOnly: true,
                path: clientEndpoint ? clientEndpoint.pathname : '/',
                domain: clientEndpoint ? clientEndpoint.hostname : undefined,
            })
            .send(userProfile);
    } catch (err) {
        reply.send(err);
    }
}

async function logoutHandler(
    fastify: FastifyInstance,
    req: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
) {
    try {
        await fastify.authService.logout(req);

        const clientEndpoint = separateURL(fastify.config.CLIENT_ENDPOINT);

        reply
            .clearCookie('accessToken', {
                httpOnly: true,
                path: clientEndpoint ? clientEndpoint.pathname : '/',
                domain: clientEndpoint ? clientEndpoint.hostname : undefined,
            })
            .clearCookie('refreshToken', {
                httpOnly: true,
                path: clientEndpoint ? clientEndpoint.pathname : '/',
                domain: clientEndpoint ? clientEndpoint.hostname : undefined,
            })
            .code(200)
            .send('Success');
    } catch (err) {
        reply.send(err);
    }
}
