"use strict";
/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 8 March 2020
 *
 * Validator service to check is credentials are correct.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
/** External imports */
const isemail_1 = __importDefault(require("isemail"));
const http_errors_1 = __importDefault(require("http-errors"));
class ValidatorService {
    constructor() {
        this.validateSignUpCredentials = async (credentials) => {
            let error = {
                errorFields: [],
                errorMessages: {},
            };
            if (!isemail_1.default.validate(credentials.email)) {
                error.errorFields.push('email');
                error.errorMessages.email = 'Неправильний шаблон.';
            }
            if (credentials.password.length < 8) {
                error.errorFields.push('password');
                error.errorMessages.password = 'Занад-то короткий пароль.';
            }
            if (Object.keys(error.errorMessages).length !== 0
                && error.errorFields.length !== 0) {
                throw new http_errors_1.default.BadRequest(JSON.stringify({
                    errorData: error,
                    message: 'Неправильні дані для входу.',
                }));
            }
        };
    }
}
module.exports = ValidatorService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3NlcnZpY2VzL3ZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7O0dBS0c7Ozs7QUFFSCx1QkFBdUI7QUFDdkIsc0RBQWdDO0FBQ2hDLDhEQUFxQztBQUtyQyxNQUFNLGdCQUFnQjtJQUF0QjtRQUNJLDhCQUF5QixHQUFHLEtBQUssRUFBRSxXQUErQixFQUFFLEVBQUU7WUFDbEUsSUFBSSxLQUFLLEdBQXFCO2dCQUMxQixXQUFXLEVBQUUsRUFBRTtnQkFDZixhQUFhLEVBQUUsRUFBRTthQUNwQixDQUFDO1lBRUYsSUFBSSxDQUFDLGlCQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDeEMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2hDLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxHQUFHLHNCQUFzQixDQUFDO2FBQ3REO1lBRUQsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ2pDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUNuQyxLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsR0FBRywyQkFBMkIsQ0FBQzthQUM5RDtZQUVELElBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUM7bUJBQzFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFDbkM7Z0JBQ0UsTUFBTSxJQUFJLHFCQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7b0JBQzNDLFNBQVMsRUFBRSxLQUFLO29CQUNoQixPQUFPLEVBQUUsNkJBQTZCO2lCQUN6QyxDQUFDLENBQUMsQ0FBQzthQUNQO1FBQ0wsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztDQUFBO0FBRUQsaUJBQVMsZ0JBQWdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnk6IE9sZWtzYW5kciBCZXpydWtvdlxuICogQ3JlYXRpb24gZGF0ZTogOCBNYXJjaCAyMDIwXG4gKlxuICogVmFsaWRhdG9yIHNlcnZpY2UgdG8gY2hlY2sgaXMgY3JlZGVudGlhbHMgYXJlIGNvcnJlY3QuXG4gKi9cblxuLyoqIEV4dGVybmFsIGltcG9ydHMgKi9cbmltcG9ydCB2YWxpZGF0b3IgZnJvbSAnaXNlbWFpbCc7XG5pbXBvcnQgSHR0cEVycm9ycyBmcm9tICdodHRwLWVycm9ycyc7XG5cbi8qKiBBcHBsaWNhdGlvbidzIGltcG9ydHMgKi9cbmltcG9ydCB7IElTaWduVXBDcmVkZW50aWFscywgVFZhbGlkYXRpb25FcnJvciB9IGZyb20gJy4vdHlwZXMnO1xuXG5jbGFzcyBWYWxpZGF0b3JTZXJ2aWNlIHtcbiAgICB2YWxpZGF0ZVNpZ25VcENyZWRlbnRpYWxzID0gYXN5bmMgKGNyZWRlbnRpYWxzOiBJU2lnblVwQ3JlZGVudGlhbHMpID0+IHtcbiAgICAgICAgbGV0IGVycm9yOiBUVmFsaWRhdGlvbkVycm9yID0ge1xuICAgICAgICAgICAgZXJyb3JGaWVsZHM6IFtdLFxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlczoge30sXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCF2YWxpZGF0b3IudmFsaWRhdGUoY3JlZGVudGlhbHMuZW1haWwpKSB7XG4gICAgICAgICAgICBlcnJvci5lcnJvckZpZWxkcy5wdXNoKCdlbWFpbCcpO1xuICAgICAgICAgICAgZXJyb3IuZXJyb3JNZXNzYWdlcy5lbWFpbCA9ICfQndC10L/RgNCw0LLQuNC70YzQvdC40Lkg0YjQsNCx0LvQvtC9Lic7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3JlZGVudGlhbHMucGFzc3dvcmQubGVuZ3RoIDwgOCkge1xuICAgICAgICAgICAgZXJyb3IuZXJyb3JGaWVsZHMucHVzaCgncGFzc3dvcmQnKTtcbiAgICAgICAgICAgIGVycm9yLmVycm9yTWVzc2FnZXMucGFzc3dvcmQgPSAn0JfQsNC90LDQtC3RgtC+INC60L7RgNC+0YLQutC40Lkg0L/QsNGA0L7Qu9GMLic7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhlcnJvci5lcnJvck1lc3NhZ2VzKS5sZW5ndGggIT09IDBcbiAgICAgICAgICAgICYmIGVycm9yLmVycm9yRmllbGRzLmxlbmd0aCAhPT0gMFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBIdHRwRXJyb3JzLkJhZFJlcXVlc3QoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIGVycm9yRGF0YTogZXJyb3IsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ9Cd0LXQv9GA0LDQstC40LvRjNC90ZYg0LTQsNC90ZYg0LTQu9GPINCy0YXQvtC00YMuJyxcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0ID0gVmFsaWRhdG9yU2VydmljZTtcbiJdfQ==