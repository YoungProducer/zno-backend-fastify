/** External imports */
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import omit from 'lodash/omit';

/** Application's imports */
import { separateURL } from "../utils/separateURL";

export const adminAuthPreHandler = async (
    fastify: FastifyInstance,
    req: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
) => {
    try {
        /** Extract access token from cookies */
        const accessToken = req.cookies['a_accessToken'];

        /** Verify token */
        const userProfile = await fastify.accessService.verifyToken(accessToken);

        /** Set user data to req body */
        req.params.userProfile = userProfile;
    } catch (err) {
        try {
            /** Extract refresh token from cookies */
            const refreshToken = req.cookies['a_refreshToken'];

            /** Verify token */
            const userProfile = await fastify.refreshService.verifyToken(refreshToken);

            /** Generate new tokens */
            const newAccessToken = await fastify.accessService.generateToken(omit(userProfile, 'hash'));
            const newRefreshToken = await fastify.refreshService.generateToken(userProfile);

            const url = separateURL(fastify.config.CLIENT_ENDPOINT);

            /** Set profile to req body */
            req.params.userProfile = omit(userProfile, 'hash');

            /** Set new tokens pair to cookies */
            reply
                .setCookie('a_accessToken', newAccessToken, {
                    maxAge: Number(fastify.config.JWT_ACCESS_COOKIES_MAX_AGE),
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    path: url.pathname,
                    domain: url.hostname,
                })
                .setCookie('a_refreshToken', newRefreshToken, {
                    maxAge: Number(fastify.config.JWT_REFRESH_COOKIES_MAX_AGE),
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    path: url.pathname,
                    domain: url.hostname,
                });
        } catch (err) {
            reply.send(err);
        }
    }
};
