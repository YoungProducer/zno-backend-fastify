// /**
//  * Created by: Oleksandr Bezrukov
//  * Creation date: 10 March 2020
//  *
//  * Create test suites for error handler.
//  */

// /** Application's imports */
// import { errorHandler } from '../error-handler';

// describe('Error handler', () => {
//     test('If input is json stringified value', () => {
//         /** Create object for stringifying */
//         const object = {
//             message: 'foo',
//             test: 'bar',
//         };

//         /** Define input value */
//         const value = JSON.stringify(object);

//         /** Assert error handler returns parsed string */
//         expect(errorHandler(value)).toEqual(object);
//     });

//     test('If input is default object', () => {
//         /** Define input value */
//         const value = {
//             message: 'foo',
//             test: 'bar',
//         };

//         /** Assert error handler return input value */
//         expect(errorHandler(value)).toEqual(value);
//     });
// });
