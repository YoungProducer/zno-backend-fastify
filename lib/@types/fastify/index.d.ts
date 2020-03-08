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
import UserService from '../../auth/service';
import AccessService from '../../services/access-service';

import JwtAccess, { TJwtAccess } from '../../plugins/jwtAccess';

declare module 'fastify' {
  export interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse,
  > {
    bcryptHasher: BcryptHasher;
    validatorService: ValidatorService;
    accessService: AccessService;
    userService: UserService;
    authPreHandler: TJwtAccess;
  }
}