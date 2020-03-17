// /**
//  * Created by: Oleksandr Bezrukov
//  * Creation date: 10 March 2020
//  *
//  * Create test suites for validator service.
//  */

// /** External imports */
// import HttpErrors from 'http-errors';

// /** Application's imports */
// import ValidatorService from '../validator';

// describe('Validator service', () => {
//     const validatorService = new ValidatorService();

//     test('If both fields are invalid', async () => {
//         const credentials = {
//             email: 'foo',
//             password: 'pass',
//         };

//         let error;

//         try {
//             await validatorService.validateSignUpCredentials(credentials);
//         } catch (err) {
//             error = err;
//         }

//         expect(error).toEqual(new HttpErrors.BadRequest(JSON.stringify({
//             error: {
//                 errorFields: ['email', 'password'],
//                 errorMessages: {
//                     email: 'Неправильний шаблон.',
//                     password: 'Занад-то короткий пароль.',
//                 },
//             },
//             message: 'Неправильні дані для входу.',
//         })));
//     });

//     test('If email field is invalid', async () => {
//         const credentials = {
//             email: 'foo@gmail.com',
//             password: 'pass',
//         };

//         let error;

//         try {
//             await validatorService.validateSignUpCredentials(credentials);
//         } catch (err) {
//             error = err;
//         }

//         expect(error).toEqual(new HttpErrors.BadRequest(JSON.stringify({
//             error: {
//                 errorFields: ['password'],
//                 errorMessages: {
//                     password: 'Занад-то короткий пароль.',
//                 },
//             },
//             message: 'Неправильні дані для входу.',
//         })));
//     });

//     test('If password field is invalid', async () => {
//         const credentials = {
//             email: 'foo',
//             password: 'password',
//         };

//         let error;

//         try {
//             await validatorService.validateSignUpCredentials(credentials);
//         } catch (err) {
//             error = err;
//         }

//         expect(error).toEqual(new HttpErrors.BadRequest(JSON.stringify({
//             error: {
//                 errorFields: ['email'],
//                 errorMessages: {
//                     email: 'Неправильний шаблон.',
//                 },
//             },
//             message: 'Неправильні дані для входу.',
//         })));
//     });

//     test('If both fields filled correctly', async () => {
//         const credentials = {
//             email: 'foo@gmail.com',
//             password: 'password',
//         };

//         let error;

//         try {
//             await validatorService.validateSignUpCredentials(credentials);
//         } catch (err) {}

//         expect(error).toBeUndefined();
//     });
// });
