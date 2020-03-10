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
import { IRefreshReturnData } from "./types";
import {
    me,
    signin,
    signup,
} from './schema';

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
        fastify.validatorService.validateSignUpCredentials(credentials);

        /** Hash password */
        credentials.password = await fastify.bcryptHasher.hashPassword(credentials.password);

        /** Get created user */
        const user = await prisma.createUser({
            ...credentials,
            role: 'DEFAULT_USER',
        });

        /** Delete password */
        delete user.password;

        return { ...user };
    } catch (err) {
        reply.send(err);
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
        const user: Omit<User, 'password'> = await fastify.userService.verifyCredentials(credentials);

        const userProfile: UserProfile = fastify.userService.convertToUserProfile(user);

        const accessToken: string = await fastify.accessService.generateToken(userProfile);

        const refreshToken: string = await fastify.refreshService.generateToken(userProfile);

        reply
            .setCookie('accessToken', accessToken, {
                maxAge: credentials.remember
                    ? Number(fastify.config.JWT_ACCESS_COOKIES_MAX_AGE)
                    : undefined,
                httpOnly: true,
                path: '/',
            })
            .setCookie('refreshToken', refreshToken, {
                maxAge: credentials.remember
                    ? Number(fastify.config.JWT_REFRESH_COOKIES_MAX_AGE)
                    : undefined,
                httpOnly: true,
                path: '/',
            })
            .send(user);
    } catch (err) {
        reply.send(err);
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
        reply.send(err);
    }
}

async function refreshHandler(
    fastify: FastifyInstance,
    req: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
) {
    try {
        const { accessToken, refreshToken, userProfile }: IRefreshReturnData = await fastify.authService.refresh(req);

        reply
            .setCookie('accessToken', accessToken, {
                maxAge: Number(fastify.config.JWT_ACCESS_COOKIES_MAX_AGE),
                httpOnly: true,
                path: '/',
            })
            .setCookie('refreshToken', refreshToken, {
                maxAge: Number(fastify.config.JWT_REFRESH_COOKIES_MAX_AGE),
                httpOnly: true,
                path: '/',
            })
            .send(userProfile);
    } catch (err) {
        reply.send(err);
    }
}
