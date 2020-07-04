/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 8 April 2020
 *
 * Define main types and interfaces for admin auth controller and service.
 */

/** External imports */
import fastify, { FastifyRequest, FastifyInstance, FastifyReply } from "fastify";
import { IncomingMessage, ServerResponse } from "http";

/** Application's imports */
import { UserProfile } from "../services/types";
import { UserRole } from "../models/user";

export interface User {
    email: string;
    id: string;
    role: UserRole;
}

export namespace AdminAuth {
    export namespace Service {
        /** ================================== */
        export type SignInPayload = {
            email: string;
            password: string;
        };
        export type SignInReturn = UserProfile;
        export type SignIn = (payload: SignInPayload, reply: FastifyReply<ServerResponse>) => Promise<SignInReturn>;

        /** ================================== */
        export type MeReturn = UserProfile;
        export type Me = (req: FastifyRequest<IncomingMessage>) => Promise<MeReturn>;

        /** ================================== */
        export type Logout = (req: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => Promise<void>;
    }

    export namespace Handlers {
        export type SigninHandler = (
            fastify: FastifyInstance,
            req: FastifyRequest<IncomingMessage>,
            reply: FastifyReply<ServerResponse>,
        ) => Promise<void>;

        export type MeHandler = (
            fastify: FastifyInstance,
            req: FastifyRequest<IncomingMessage>,
            reply: FastifyReply<ServerResponse>,
        ) => Promise<void>;

        export type LogoutHandler = (
            fastify: FastifyInstance,
            req: FastifyRequest<IncomingMessage>,
            reply: FastifyReply<ServerResponse>,
        ) => Promise<void>;
    }

    export interface Service {
        instance: FastifyInstance;

        adminEndpoint: URL | undefined;
        accessTokenCookiesMaxAge: number;
        refreshTokenCookiesMaxAge: number;

        signin: Service.SignIn;
        me: Service.Me;
        logout: Service.Logout;
    }
}
