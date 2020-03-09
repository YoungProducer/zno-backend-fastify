/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 8 March 2020
 *
 * Redefine fastify instance for correct decoreators usage.
 */


/** External imports */
import fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

/** Application's imports */
import BcryptHasher from '../../services/bcrypt-hasher';
import ValidatorService from '../../services/validator';
import UserService from '../../services/user-service';
import AccessService from '../../services/access-service';
import RefreshService from '../../services/refresh-service';

import AuthService from '../../auth/service';

import { TJwtAccess } from '../../plugins/jwtAccess';

interface Config {
  JWT_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_ACCESS_COOKIES_MAX_AGE: string;
  JWT_REFRESH_EXPIRES_IN: string;
  JWT_REFRESH_COOKIES_MAX_AGE: string;
}

declare module 'fastify' {
  export interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse,
  > {
    bcryptHasher: BcryptHasher;
    validatorService: ValidatorService;
    accessService: AccessService;
    refreshService: RefreshService;
    userService: UserService;
    authService: AuthService;
    authPreHandler: TJwtAccess;
    config: Config;
  }
}