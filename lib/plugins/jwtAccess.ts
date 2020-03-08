/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * Create custom handler to authenticate users.
 */

import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { IncomingMessage, ServerResponse } from "http";

export type TJwtAccess = (
    req: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
) => Promise<void>;

export default async function jwtAccess(
    fastify: FastifyInstance,
    req: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
) {
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
}
