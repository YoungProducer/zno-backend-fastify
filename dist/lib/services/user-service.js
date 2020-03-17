"use strict";
/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * User service to make authorization and authentication.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const http_errors_1 = __importDefault(require("http-errors"));
const prisma_client_1 = require("../../prisma/generated/prisma-client");
class UserService {
    constructor(fastify) {
        this.instance = fastify;
    }
    async verifyCredentials(credentials) {
        const errorData = {
            errorFields: [],
            errorMessages: {},
        };
        /** Find user in data base by email */
        const foundUser = await prisma_client_1.prisma.user({
            email: credentials.email,
        });
        if (!foundUser) {
            errorData.errorFields.push('email');
            errorData.errorMessages.email = 'Користувача з таким емейлом не знайдено.';
            throw new http_errors_1.default.BadRequest(JSON.stringify({
                errorData,
                message: 'Неправильні данні користувача.',
            }));
        }
        /** Check is password correct */
        const isMatch = await this.instance.bcryptHasher.comparePasswords(credentials.password, foundUser.password);
        if (!isMatch) {
            errorData.errorFields.push('password');
            errorData.errorMessages.password = 'Неправильний пароль.';
            throw new http_errors_1.default.BadRequest(JSON.stringify({
                errorData,
                message: 'Неправильні данні користувача.',
            }));
        }
        /** Delete password from user object */
        delete foundUser.password;
        return foundUser;
    }
    convertToUserProfile(user) {
        return {
            id: user.id,
            email: user.email,
            role: user.role,
        };
    }
}
module.exports = UserService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3NlcnZpY2VzL3VzZXItc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7O0dBS0c7Ozs7QUFJSCw4REFBcUM7QUFJckMsd0VBQW9FO0FBRXBFLE1BQU0sV0FBVztJQUdiLFlBQVksT0FBd0I7UUFDaEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDNUIsQ0FBQztJQUVELEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxXQUEyRDtRQUMvRSxNQUFNLFNBQVMsR0FBcUI7WUFDaEMsV0FBVyxFQUFFLEVBQUU7WUFDZixhQUFhLEVBQUUsRUFBRTtTQUNwQixDQUFDO1FBRUYsc0NBQXNDO1FBQ3RDLE1BQU0sU0FBUyxHQUFHLE1BQU0sc0JBQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxLQUFLO1NBQzNCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDWixTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwQyxTQUFTLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBRywwQ0FBMEMsQ0FBQztZQUUzRSxNQUFNLElBQUkscUJBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDM0MsU0FBUztnQkFDVCxPQUFPLEVBQUUsZ0NBQWdDO2FBQzVDLENBQUMsQ0FBQyxDQUFDO1NBQ1A7UUFFRCxnQ0FBZ0M7UUFDaEMsTUFBTSxPQUFPLEdBQVksTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVySCxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1YsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDdkMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEdBQUcsc0JBQXNCLENBQUM7WUFFMUQsTUFBTSxJQUFJLHFCQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQzNDLFNBQVM7Z0JBQ1QsT0FBTyxFQUFFLGdDQUFnQzthQUM1QyxDQUFDLENBQUMsQ0FBQztTQUNQO1FBRUQsdUNBQXVDO1FBQ3ZDLE9BQU8sU0FBUyxDQUFDLFFBQVEsQ0FBQztRQUUxQixPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBRUQsb0JBQW9CLENBQUMsSUFBNEI7UUFDN0MsT0FBTztZQUNILEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUNYLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7U0FDbEIsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQUVELGlCQUFTLFdBQVcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieTogT2xla3NhbmRyIEJlenJ1a292XG4gKiBDcmVhdGlvbiBkYXRlOiA5IE1hcmNoIDIwMjBcbiAqXG4gKiBVc2VyIHNlcnZpY2UgdG8gbWFrZSBhdXRob3JpemF0aW9uIGFuZCBhdXRoZW50aWNhdGlvbi5cbiAqL1xuXG4vKiogRXh0ZXJuYWwgaW1wb3J0cyAqL1xuaW1wb3J0IGZhc3RpZnksIHsgRmFzdGlmeUluc3RhbmNlIH0gZnJvbSAnZmFzdGlmeSc7XG5pbXBvcnQgSHR0cEVycm9ycyBmcm9tICdodHRwLWVycm9ycyc7XG5cbi8qKiBBcHBsaWNhdGlvbidzIGltcG9ydHMgKi9cbmltcG9ydCB7IElTaWduSW5DcmVkZW50aWFscywgVFZhbGlkYXRpb25FcnJvciB9IGZyb20gJy4uL3NlcnZpY2VzL3R5cGVzJztcbmltcG9ydCB7IFVzZXIsIHByaXNtYSB9IGZyb20gJy4uLy4uL3ByaXNtYS9nZW5lcmF0ZWQvcHJpc21hLWNsaWVudCc7XG5cbmNsYXNzIFVzZXJTZXJ2aWNlIHtcbiAgICBpbnN0YW5jZSE6IEZhc3RpZnlJbnN0YW5jZTtcblxuICAgIGNvbnN0cnVjdG9yKGZhc3RpZnk6IEZhc3RpZnlJbnN0YW5jZSkge1xuICAgICAgICB0aGlzLmluc3RhbmNlID0gZmFzdGlmeTtcbiAgICB9XG5cbiAgICBhc3luYyB2ZXJpZnlDcmVkZW50aWFscyhjcmVkZW50aWFsczogUGljazxJU2lnbkluQ3JlZGVudGlhbHMsICdwYXNzd29yZCcgfCAnZW1haWwnPik6IFByb21pc2U8T21pdDxVc2VyLCAncGFzc3dvcmQnPj4ge1xuICAgICAgICBjb25zdCBlcnJvckRhdGE6IFRWYWxpZGF0aW9uRXJyb3IgPSB7XG4gICAgICAgICAgICBlcnJvckZpZWxkczogW10sXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2VzOiB7fSxcbiAgICAgICAgfTtcblxuICAgICAgICAvKiogRmluZCB1c2VyIGluIGRhdGEgYmFzZSBieSBlbWFpbCAqL1xuICAgICAgICBjb25zdCBmb3VuZFVzZXIgPSBhd2FpdCBwcmlzbWEudXNlcih7XG4gICAgICAgICAgICBlbWFpbDogY3JlZGVudGlhbHMuZW1haWwsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghZm91bmRVc2VyKSB7XG4gICAgICAgICAgICBlcnJvckRhdGEuZXJyb3JGaWVsZHMucHVzaCgnZW1haWwnKTtcbiAgICAgICAgICAgIGVycm9yRGF0YS5lcnJvck1lc3NhZ2VzLmVtYWlsID0gJ9Ca0L7RgNC40YHRgtGD0LLQsNGH0LAg0Lcg0YLQsNC60LjQvCDQtdC80LXQudC70L7QvCDQvdC1INC30L3QsNC50LTQtdC90L4uJztcblxuICAgICAgICAgICAgdGhyb3cgbmV3IEh0dHBFcnJvcnMuQmFkUmVxdWVzdChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgZXJyb3JEYXRhLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfQndC10L/RgNCw0LLQuNC70YzQvdGWINC00LDQvdC90ZYg0LrQvtGA0LjRgdGC0YPQstCw0YfQsC4nLFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqIENoZWNrIGlzIHBhc3N3b3JkIGNvcnJlY3QgKi9cbiAgICAgICAgY29uc3QgaXNNYXRjaDogYm9vbGVhbiA9IGF3YWl0IHRoaXMuaW5zdGFuY2UuYmNyeXB0SGFzaGVyLmNvbXBhcmVQYXNzd29yZHMoY3JlZGVudGlhbHMucGFzc3dvcmQsIGZvdW5kVXNlci5wYXNzd29yZCk7XG5cbiAgICAgICAgaWYgKCFpc01hdGNoKSB7XG4gICAgICAgICAgICBlcnJvckRhdGEuZXJyb3JGaWVsZHMucHVzaCgncGFzc3dvcmQnKTtcbiAgICAgICAgICAgIGVycm9yRGF0YS5lcnJvck1lc3NhZ2VzLnBhc3N3b3JkID0gJ9Cd0LXQv9GA0LDQstC40LvRjNC90LjQuSDQv9Cw0YDQvtC70YwuJztcblxuICAgICAgICAgICAgdGhyb3cgbmV3IEh0dHBFcnJvcnMuQmFkUmVxdWVzdChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgZXJyb3JEYXRhLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfQndC10L/RgNCw0LLQuNC70YzQvdGWINC00LDQvdC90ZYg0LrQvtGA0LjRgdGC0YPQstCw0YfQsC4nLFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqIERlbGV0ZSBwYXNzd29yZCBmcm9tIHVzZXIgb2JqZWN0ICovXG4gICAgICAgIGRlbGV0ZSBmb3VuZFVzZXIucGFzc3dvcmQ7XG5cbiAgICAgICAgcmV0dXJuIGZvdW5kVXNlcjtcbiAgICB9XG5cbiAgICBjb252ZXJ0VG9Vc2VyUHJvZmlsZSh1c2VyOiBPbWl0PFVzZXIsICdwYXNzd29yZCc+KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpZDogdXNlci5pZCxcbiAgICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICAgICAgcm9sZTogdXNlci5yb2xlLFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuZXhwb3J0ID0gVXNlclNlcnZpY2U7XG4iXX0=