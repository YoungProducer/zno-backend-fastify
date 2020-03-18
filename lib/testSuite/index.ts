/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 18 March 2020
 *
 * Test suite controller which handle all requests related to test suites.
 */

/** External imports */
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { IncomingMessage, ServerResponse } from 'http';

/** Application's imports */
import { ICreateTestSuiteCredentials, IGetTestSuiteCredentials } from './types';
import {
    createTestSuite,
    getTestSuite,
} from './schema';

export = async function (
    fastify: FastifyInstance,
    opts: any,
) {
    fastify.post('test-suite', { schema: createTestSuite }, async (
        req: FastifyRequest<IncomingMessage>,
        reply: FastifyReply<ServerResponse>,
    ) => await createTestSuiteHandler(fastify, req, reply));

    fastify.get('test-suite', { schema: getTestSuite }, async (
        req: FastifyRequest<IncomingMessage>,
        reply: FastifyReply<ServerResponse>,
    ) => await getTestSuiteHandler(fastify, req, reply));
};

const createTestSuiteHandler = async (
    fastify: FastifyInstance,
    req: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
) => {
    const credentials: ICreateTestSuiteCredentials = req.body;

    try {
        const testSuite = await fastify.testSuiteService.create(credentials);

        reply
            .code(201)
            .send(testSuite);
    } catch (err) {
        reply.send(err);
    }
};

const getTestSuiteHandler = async (
    fastify: FastifyInstance,
    req: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
) => {
    /** Extract credentials from query */
    const credentials: IGetTestSuiteCredentials = req.query as IGetTestSuiteCredentials;

    try {
        const testSuite = await fastify.testSuiteService.testSuite(credentials);

        reply
            .status(200)
            .send(testSuite);
    } catch (err) {
        reply.send(err);
    }
};
