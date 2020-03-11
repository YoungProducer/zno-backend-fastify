// /**
//  * Created by: Oleksandr Bezrukov
//  * Creation date: 10 March 2020
//  *
//  * Create test suites for user service.
//  */

// /** Application's imports */
// import { instance } from '../../index';
// import { prisma } from '../../../prisma/generated/prisma-client';
// import { FastifyInstance } from 'fastify';
// import UserService from '../user-service';

// describe('User service', () => {
//     test(`If email doesn't exist in db`, async () => {
//         /** Mock user method */
//         prisma.user = jest.fn().mockResolvedValueOnce(undefined);

//         /** Create user service instance */
//         const userService = new UserService(instance);

//         let error;

//         try {
//             /** Invoke method */
//             await userService.verifyCredentials({
//                 email: 'foo',
//                 password: 'foo',
//             });
//         } catch (err) {
//             error = err;
//         }

//         /** Parse string */
//         const parsedError = JSON.parse(error.message);

//         /** Assert error has right keys */
//         expect(parsedError.error).toHaveProperty('errorFields');
//         expect(parsedError.error).toHaveProperty('errorMessages');
//     });
// });
