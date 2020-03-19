/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 18 March 2020
 *
 * Test suite controller which handle all requests related to test suites.
 */

/** External imports */
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { IncomingMessage, ServerResponse } from 'http';
import _ from 'lodash';

/** Application's imports */
import {
    ICreateTestSuiteHandlerCredentials,
    IGetTestSuiteCredentials,
    IUploadImagesHandlerCredentials,
    IGetTestSuiteImagesCredentials,
} from './types';
import {
    createTestSuite,
    getTestSuite,
    uploadImages,
    getTestSuiteImages,
} from './schema';

export = async function (
    fastify: FastifyInstance,
    opts: any,
) {
    fastify.register(async (fastify: FastifyInstance) => {
        fastify.addHook('preHandler', async (
            req: FastifyRequest<IncomingMessage>,
            reply: FastifyReply<ServerResponse>,
        ) => {
            await fastify.authPreHandler(req, reply);
            return;
        });
        fastify.post('test-suite', { schema: createTestSuite }, async (
            req: FastifyRequest<IncomingMessage>,
            reply: FastifyReply<ServerResponse>,
        ) => await createTestSuiteHandler(fastify, req, reply));

        fastify.get('test-suite', { schema: getTestSuite }, async (
            req: FastifyRequest<IncomingMessage>,
            reply: FastifyReply<ServerResponse>,
        ) => await getTestSuiteHandler(fastify, req, reply));

        fastify.put('test-suite/:id/images/:type', { schema: uploadImages }, async (
            req: FastifyRequest<IncomingMessage>,
            reply: FastifyReply<ServerResponse>,
        ) => await uploadImagesHandler(fastify, req, reply));

        fastify.get('test-suite/:id/images/:type', { schema: getTestSuiteImages }, async (
            req: FastifyRequest<IncomingMessage>,
            reply: FastifyReply<ServerResponse>,
        ) => await getTestSuiteImagesHandler(fastify, req, reply));
    });
};

const createTestSuiteHandler = async (
    fastify: FastifyInstance,
    req: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
) => {
    const credentials: ICreateTestSuiteHandlerCredentials = req.body;

    /** Exclude images from credentials */
    const clearCredentials = _.pick(credentials, ['subjectId', 'subSubjectId', 'sessions', 'trainings', 'theme', 'answers']);

    /** Exclude all properties except images from credentials */
    const clearImages = _.omit(credentials, ['subjectId', 'subSubjectId', 'sessions', 'trainings', 'theme', 'answers']);

    /** Get clearImages entries */
    const clearImagesEntries = Object.entries(clearImages);

    /** Divide tasks and explanations images */
    const tasksImages = clearImagesEntries.reduce((acc: any[], curr: [string, any]) => {
        if (curr[0].startsWith('task')) {
            return acc.concat(curr[1]);
        }
        return acc;
    }, []);

    const explanationsImages = clearImagesEntries.reduce((acc: any[], curr: [string, any]) => {
        if (curr[0].startsWith('explanation')) {
            return acc.concat(curr[1]);
        }
        return acc;
    }, []);

    try {
        const testSuite = await fastify.testSuiteService.create({
            ...clearCredentials,
            tasksImages,
            explanationsImages,
        });

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

const uploadImagesHandler = async (
    fastify: FastifyInstance,
    req: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
) => {
    /** Extract credentials from body */
    const credentials: IUploadImagesHandlerCredentials = {
        ...req.body,
        ...req.params,
    };

    /**
     * Remove id key from credentials object
     * this function will returns object with images
     */
    const images = _.omit(credentials, 'id', 'type');

    /** Convert object of images to array from images */
    const imagesArray = Object
        .entries(images)
        .reduce((acc: any[], curr: any) => {
            return acc.concat(curr[1]);
        }, []);

    /** Upload images */
    const uploadedImagesData = await fastify.testSuiteService.uploadImages({
        id: credentials.id,
        images: imagesArray,
        type: credentials.type,
    });

    reply
        .code(201)
        .send(uploadedImagesData);
};

const getTestSuiteImagesHandler = async (
    fastify: FastifyInstance,
    req: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
) => {
    /** Extract credentials from request params */
    const credentials: IGetTestSuiteImagesCredentials = req.params as IGetTestSuiteImagesCredentials;

    try {
        const images = await fastify.testSuiteService.getTestSuiteImages(credentials);

        reply.send(images);
    } catch (err) {
        reply.send(err);
    }
};
