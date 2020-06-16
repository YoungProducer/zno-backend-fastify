/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 8 March 2020
 *
 * Redefine fastify instance for correct decoreators usage.
 */


/** External imports */
import { Server, IncomingMessage, ServerResponse } from 'http';

/** Application's imports */
import BcryptHasher from '../../services/bcrypt-hasher';
import ValidatorService from '../../services/validator';
import UserService from '../../services/user-service';
import AccessService from '../../services/access-service';
import RefreshService from '../../services/refresh-service';

import AuthService from '../../auth/service';

import { TJwtAccess } from '../../plugins/jwtAccess';
import SubjectService from '../../subject/service';
import SubjectConfigService from '../../subjectConfig/service';
import TestSuiteService from '../../testSuite/service';
import { AdminAuth } from '../../admin-auth/types';

interface Config {
  JWT_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_ACCESS_COOKIES_MAX_AGE: string;
  JWT_REFRESH_EXPIRES_IN: string;
  JWT_REFRESH_COOKIES_MAX_AGE: string;
  JWT_SESSION_EXPIRES_IN: string;
  S3_BUCKET: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  CLIENT_ENDPOINT: string;
  CLIENT_MOBILE_ENDPOINT: string;
  ADMIN_ENDPOINT: string;
  CURRENT_ENDPOINT?: string;
  PORT?: string;
  HOST?: string;
  PROTOCOL?: string;
  MONGO_USERNAME: string;
  MONGO_PASSWORD: string;
  MONGO_DB_NAME: string;
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
    adminAuthService: AdminAuth.Service;
    subjectService: SubjectService;
    subjectConfigService: SubjectConfigService;
    testSuiteService: TestSuiteService;
    authPreHandler: TJwtAccess;
    config: Config;
  }
}