/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 8 April 2020
 *
 * Service which handles core operations related to admin auth.
 */

/** External imports */
import { FastifyInstance } from 'fastify';
import HttpErrors from 'http-errors';

/** Application's imports */
import { AdminAuth } from './types';
import { separateURL } from '../utils/separateURL';
import { userModel } from '../models/user';

class AdminAuthService implements AdminAuth.Service {
    instance!: FastifyInstance;
    adminEndpoint: URL;
    accessTokenCookiesMaxAge: number;
    refreshTokenCookiesMaxAge: number;
    secureCookie: boolean;

    constructor(fastify: FastifyInstance) {
        this.instance = fastify;

        this.adminEndpoint = separateURL(this.instance.config.ADMIN_ENDPOINT);
        this.accessTokenCookiesMaxAge = Number(this.instance.config.JWT_ACCESS_COOKIES_MAX_AGE);
        this.refreshTokenCookiesMaxAge = Number(this.instance.config.JWT_REFRESH_COOKIES_MAX_AGE);

        this.secureCookie = process.env.NODE_ENV !== 'development';
    }

    signin: AdminAuth.Service.SignIn = async (payload, reply) => {
        const user = await this.instance.userService.verifyCredentials(payload);

        const isAdmin = await this.instance.userService.isAdmin(payload.email);

        if (!isAdmin) {
            throw new HttpErrors.Unauthorized('Цей користувач не є адміністратором.');
        }

        const userProfile = this.instance.userService.convertToUserProfile(user);

        const accessToken = await this.instance.accessService.generateToken(userProfile);
        const refreshToken = await this.instance.refreshService.generateToken(userProfile);

        reply
            .setCookie('a_accessToken', accessToken, {
                httpOnly: true,
                secure: this.secureCookie,
                maxAge: this.accessTokenCookiesMaxAge,
                path: this.adminEndpoint.pathname,
                domain: this.adminEndpoint.hostname,
                sameSite: 'lax',
            })
            .setCookie('a_refreshToken', refreshToken, {
                httpOnly: true,
                secure: this.secureCookie,
                maxAge: this.refreshTokenCookiesMaxAge,
                path: this.adminEndpoint.pathname,
                domain: this.adminEndpoint.hostname,
                sameSite: 'lax',
            });

        return userProfile;
    }

    me: AdminAuth.Service.Me = async (req) => {
        const user = req.params.userProfile;

        return user;
    }

    logout: AdminAuth.Service.Logout = async (req, reply) => {
        /** Extract refresh token from cookies */
        const refreshToken = req.cookies['a_refreshToken'];

        /** Verify token */
        const userProfile = await this.instance.refreshService.verifyToken(refreshToken);

        await userModel.deleteOne({
            loginId: userProfile.hash,
        });

        reply
            .clearCookie('a_accessToken', {
                httpOnly: true,
                secure: this.secureCookie,
                path: this.adminEndpoint.pathname,
                domain: this.adminEndpoint.hostname,
                sameSite: 'lax',
            })
            .clearCookie('a_refreshToken', {
                httpOnly: true,
                secure: this.secureCookie,
                path: this.adminEndpoint.pathname,
                domain: this.adminEndpoint.hostname,
                sameSite: 'lax',
            });
    }
}

export = AdminAuthService;
