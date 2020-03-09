/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * Describe main types and interface related to auth controller.
 */

/** External imports */
import { FastifyInstance, FastifyRequest } from 'fastify';
import { IncomingMessage } from 'http';

/** Application's imports */
import { UserProfile } from '../services/types';

export interface IRefreshReturnData {
    accessToken: string;
    refreshToken: string;
    userProfile: UserProfile;
}

export interface IAuthService {
    instance: FastifyInstance;
    refresh(req: FastifyRequest<IncomingMessage>): Promise<IRefreshReturnData>;
}
