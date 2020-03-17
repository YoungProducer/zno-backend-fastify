"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import reflect metadata for dependency injection mechanism
require("reflect-metadata");
/** External imports */
const path_1 = __importDefault(require("path"));
const fastify_1 = __importDefault(require("fastify"));
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const fastify_formbody_1 = __importDefault(require("fastify-formbody"));
const fastify_cors_1 = __importDefault(require("fastify-cors"));
const fastify_jwt_1 = __importDefault(require("fastify-jwt"));
const fastify_cookie_1 = __importDefault(require("fastify-cookie"));
const lodash_1 = __importDefault(require("lodash"));
/** Application's imports */
const bcrypt_hasher_1 = __importDefault(require("./services/bcrypt-hasher"));
const validator_1 = __importDefault(require("./services/validator"));
const access_service_1 = __importDefault(require("./services/access-service"));
const refresh_service_1 = __importDefault(require("./services/refresh-service"));
const user_service_1 = __importDefault(require("./services/user-service"));
const auth_1 = __importDefault(require("./auth"));
const subject_1 = __importDefault(require("./subject"));
const subjectConfig_1 = __importDefault(require("./subjectConfig"));
const service_1 = __importDefault(require("./auth/service"));
const service_2 = __importDefault(require("./subject/service"));
const service_3 = __importDefault(require("./subjectConfig/service"));
/** Import env config */
if (process.env.NODE_ENV !== 'production')
    require('dotenv').config();
const schema = {
    type: 'object',
    required: [
        'JWT_SECRET',
        'JWT_ACCESS_EXPIRES_IN',
        'JWT_ACCESS_COOKIES_MAX_AGE',
        'JWT_REFRESH_EXPIRES_IN',
        'JWT_REFRESH_COOKIES_MAX_AGE',
        'JWT_SESSION_EXPIRES_IN',
    ],
    properties: {
        JWT_SECRET: { type: 'string' },
        JWT_ACCESS_EXPIRES_IN: { type: 'string' },
        JWT_ACCESS_COOKIES_MAX_AGE: { type: 'string' },
        JWT_REFRESH_EXPIRES_IN: { type: 'string' },
        JWT_REFRESH_COOKIES_MAX_AGE: { type: 'string' },
        JWT_SESSION_EXPIRES_IN: { type: 'string' },
    },
};
const decorateFastifyInstance = async (fastify) => {
    const bcryptHasher = new bcrypt_hasher_1.default();
    fastify.decorate('bcryptHasher', bcryptHasher);
    const validatorService = new validator_1.default();
    fastify.decorate('validatorService', validatorService);
    const userService = new user_service_1.default(fastify);
    fastify.decorate('userService', userService);
    const accessService = new access_service_1.default(fastify);
    fastify.decorate('accessService', accessService);
    const refreshService = new refresh_service_1.default(fastify);
    fastify.decorate('refreshService', refreshService);
    const authService = new service_1.default(fastify);
    fastify.decorate('authService', authService);
    const subjectService = new service_2.default();
    fastify.decorate('subjectService', subjectService);
    const subjectConfigService = new service_3.default();
    fastify.decorate('subjectConfigService', subjectConfigService);
    fastify.decorate('authPreHandler', async (req, reply) => {
        try {
            /** Extract access token from cookies */
            const accessToken = req.cookies['accessToken'];
            /** Verify token */
            const userProfile = await fastify.accessService.verifyToken(accessToken);
            /** Set user data to req body */
            req.params.userProfile = userProfile;
        }
        catch (err) {
            try {
                /** Extract refresh token from cookies */
                const refreshToken = req.cookies['refreshToken'];
                /** Verify token */
                const userProfile = await fastify.refreshService.verifyToken(refreshToken);
                /** Generate new tokens */
                const newAccessToken = await fastify.accessService.generateToken(lodash_1.default.omit(userProfile, 'hash'));
                const newRefreshToken = await fastify.refreshService.generateToken(userProfile);
                /** Set profile to req body */
                req.params.userProfile = lodash_1.default.omit(userProfile, 'hash');
                /** Set new tokens pair to cookies */
                reply
                    .setCookie('accessToken', newAccessToken, {
                    maxAge: Number(fastify.config.JWT_ACCESS_COOKIES_MAX_AGE),
                    httpOnly: true,
                    path: '/',
                })
                    .setCookie('refreshToken', newRefreshToken, {
                    maxAge: Number(fastify.config.JWT_REFRESH_COOKIES_MAX_AGE),
                    httpOnly: true,
                    path: '/',
                });
            }
            catch (err) {
                reply.send(err);
            }
        }
    });
};
const authenticator = async (fastify) => {
    const secret = process.env.JWT_SECRET || 'supersecret';
    fastify
        .register(fastify_jwt_1.default, {
        secret,
    });
};
const errorHandler = async (fastify) => {
    fastify.setErrorHandler((error, req, reply) => {
        if (error.statusCode) {
            reply
                .code(error.statusCode)
                .send({
                statusCode: error.statusCode,
                message: error.message,
                data: req.body.error,
            });
        }
        else {
            reply.send(error);
        }
    });
};
const instance = fastify_1.default();
exports.instance = instance;
instance
    .register(fastify_cors_1.default, {
    origin: ['http://localhost:3000', 'http://localhost:8080'],
    credentials: true,
})
    .register(require('fastify-env'), { schema })
    .register(fastify_plugin_1.default(errorHandler))
    .register(fastify_plugin_1.default(authenticator))
    .register(fastify_plugin_1.default(decorateFastifyInstance))
    .register(fastify_formbody_1.default)
    .register(fastify_cookie_1.default)
    .register((instance, opts, next) => {
    const mode = process.env.NODE_ENV || 'production';
    const clientPath = mode === 'development'
        ? '../../client/public'
        : '../../../client/build';
    instance.register(require('fastify-static'), {
        root: path_1.default.join(__dirname, clientPath),
        prefix: '/',
    });
    next();
})
    .register((instance, opts, next) => {
    instance.register(require('fastify-static'), {
        root: path_1.default.join(__dirname, '../public'),
        prefix: '/public',
    });
    next();
})
    .register(auth_1.default, { prefix: 'api/auth/user' })
    .register(subject_1.default, { prefix: 'api/subject' })
    .register(subjectConfig_1.default, { prefix: 'api/subject-config' });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw2REFBNkQ7QUFDN0QsNEJBQTBCO0FBRTFCLHVCQUF1QjtBQUN2QixnREFBd0I7QUFDeEIsc0RBQWlHO0FBQ2pHLG9FQUFnQztBQUNoQyx3RUFBK0M7QUFDL0MsZ0VBQXVDO0FBQ3ZDLDhEQUE4QjtBQUM5QixvRUFBMkM7QUFHM0Msb0RBQXVCO0FBRXZCLDRCQUE0QjtBQUM1Qiw2RUFBb0Q7QUFDcEQscUVBQW9EO0FBQ3BELCtFQUFzRDtBQUN0RCxpRkFBd0Q7QUFDeEQsMkVBQWtEO0FBSWxELGtEQUFvQztBQUNwQyx3REFBMEM7QUFDMUMsb0VBQXNEO0FBQ3RELDZEQUF5QztBQUN6QyxnRUFBK0M7QUFDL0Msc0VBQTJEO0FBRTNELHdCQUF3QjtBQUN4QixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLFlBQVk7SUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFdEUsTUFBTSxNQUFNLEdBQUc7SUFDWCxJQUFJLEVBQUUsUUFBUTtJQUNkLFFBQVEsRUFBRTtRQUNOLFlBQVk7UUFDWix1QkFBdUI7UUFDdkIsNEJBQTRCO1FBQzVCLHdCQUF3QjtRQUN4Qiw2QkFBNkI7UUFDN0Isd0JBQXdCO0tBQzNCO0lBQ0QsVUFBVSxFQUFFO1FBQ1IsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtRQUM5QixxQkFBcUIsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7UUFDekMsMEJBQTBCLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO1FBQzlDLHNCQUFzQixFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtRQUMxQywyQkFBMkIsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7UUFDL0Msc0JBQXNCLEVBQUUsRUFBRSxJQUFJ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LEVBQUU7UUFDekMsSUFBSSxFQUFFLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQztRQUN2QyxNQUFNLEVBQUUsU0FBUztLQUNwQixDQUFDLENBQUE7SUFFRixJQUFJLEVBQUUsQ0FBQztBQUNYLENBQUMsQ0FBQztLQUNELFFBQVEsQ0FBQyxjQUFjLEVBQUUsRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLENBQUM7S0FDckQsUUFBUSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxDQUFDO0tBQ3RELFFBQVEsQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxvQkFBb0IsRUFBRSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJbXBvcnQgcmVmbGVjdCBtZXRhZGF0YSBmb3IgZGVwZW5kZW5jeSBpbmplY3Rpb24gbWVjaGFuaXNtXG5pbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuXG4vKiogRXh0ZXJuYWwgaW1wb3J0cyAqL1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZmFzdGlmeSwgeyBGYXN0aWZ5SW5zdGFuY2UsIEZhc3RpZnlSZXF1ZXN0LCBGYXN0aWZ5UmVwbHksIFNjaGVtYUNvbXBpbGVyIH0gZnJvbSAnZmFzdGlmeSc7XG5pbXBvcnQgZnAgZnJvbSAnZmFzdGlmeS1wbHVnaW4nO1xuaW1wb3J0IGZhc3RpZnlGb3JtQm9keSBmcm9tICdmYXN0aWZ5LWZvcm1ib2R5JztcbmltcG9ydCBmYXN0aWZ5Q29ycyBmcm9tICdmYXN0aWZ5LWNvcnMnO1xuaW1wb3J0IGp3dCBmcm9tICdmYXN0aWZ5LWp3dCc7XG5pbXBvcnQgZmFzdGlmeUNvb2tpZSBmcm9tICdmYXN0aWZ5LWNvb2tpZSc7XG5pbXBvcnQgZmFzdGlmeVN0YXRpYyBmcm9tICdmYXN0aWZ5LXN0YXRpYyc7XG5pbXBvcnQgeyBJbmNvbWluZ01lc3NhZ2UsIFNlcnZlclJlc3BvbnNlIH0gZnJvbSAnaHR0cCc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG4vKiogQXBwbGljYXRpb24ncyBpbXBvcnRzICovXG5pbXBvcnQgQmNyeXB0SGFzaGVyIGZyb20gJy4vc2VydmljZXMvYmNyeXB0LWhhc2hlcic7XG5pbXBvcnQgVmFsaWRhdG9yU2VydmljZSBmcm9tICcuL3NlcnZpY2VzL3ZhbGlkYXRvcic7XG5pbXBvcnQgQWNjZXNzU2VydmljZSBmcm9tICcuL3NlcnZpY2VzL2FjY2Vzcy1zZXJ2aWNlJztcbmltcG9ydCBSZWZyZXNoU2VydmljZSBmcm9tICcuL3NlcnZpY2VzL3JlZnJlc2gtc2VydmljZSc7XG5pbXBvcnQgVXNlclNlcnZpY2UgZnJvbSAnLi9zZXJ2aWNlcy91c2VyLXNlcnZpY2UnO1xuXG5pbXBvcnQgand0QWNjZXNzIGZyb20gJy4vcGx1Z2lucy9qd3RBY2Nlc3MnO1xuXG5pbXBvcnQgYXV0aENvbnRyb2xsZXIgZnJvbSAnLi9hdXRoJztcbmltcG9ydCBzdWJqZWN0Q29udHJvbGxlciBmcm9tICcuL3N1YmplY3QnO1xuaW1wb3J0IHN1YmplY3RDb25maWdDb250cm9sbGVyIGZyb20gJy4vc3ViamVjdENvbmZpZyc7XG5pbXBvcnQgQXV0aFNlcnZpY2UgZnJvbSAnLi9hdXRoL3NlcnZpY2UnO1xuaW1wb3J0IFN1YmplY3RTZXJ2aWNlIGZyb20gJy4vc3ViamVjdC9zZXJ2aWNlJztcbmltcG9ydCBTdWJqZWN0Q29uZmlnU2VydmljZSBmcm9tICcuL3N1YmplY3RDb25maWcvc2VydmljZSc7XG5cbi8qKiBJbXBvcnQgZW52IGNvbmZpZyAqL1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHJlcXVpcmUoJ2RvdGVudicpLmNvbmZpZygpO1xuXG5jb25zdCBzY2hlbWEgPSB7XG4gICAgdHlwZTogJ29iamVjdCcsXG4gICAgcmVxdWlyZWQ6IFtcbiAgICAgICAgJ0pXVF9TRUNSRVQnLFxuICAgICAgICAnSldUX0FDQ0VTU19FWFBJUkVTX0lOJyxcbiAgICAgICAgJ0pXVF9BQ0NFU1NfQ09PS0lFU19NQVhfQUdFJyxcbiAgICAgICAgJ0pXVF9SRUZSRVNIX0VYUElSRVNfSU4nLFxuICAgICAgICAnSldUX1JFRlJFU0hfQ09PS0lFU19NQVhfQUdFJyxcbiAgICAgICAgJ0pXVF9TRVNTSU9OX0VYUElSRVNfSU4nLFxuICAgIF0sXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBKV1RfU0VDUkVUOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgIEpXVF9BQ0NFU1NfRVhQSVJFU19JTjogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICBKV1RfQUNDRVNTX0NPT0tJRVNfTUFYX0FHRTogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICBKV1RfUkVGUkVTSF9FWFBJUkVTX0lOOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgIEpXVF9SRUZSRVNIX0NPT0tJRVNfTUFYX0FHRTogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICBKV1RfU0VTU0lPTl9FWFBJUkVTX0lOOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgfSxcbn07XG5cbmNvbnN0IGRlY29yYXRlRmFzdGlmeUluc3RhbmNlID0gYXN5bmMgKGZhc3RpZnk6IEZhc3RpZnlJbnN0YW5jZSkgPT4ge1xuICAgIGNvbnN0IGJjcnlwdEhhc2hlciA9IG5ldyBCY3J5cHRIYXNoZXIoKTtcbiAgICBmYXN0aWZ5LmRlY29yYXRlKCdiY3J5cHRIYXNoZXInLCBiY3J5cHRIYXNoZXIpO1xuXG4gICAgY29uc3QgdmFsaWRhdG9yU2VydmljZSA9IG5ldyBWYWxpZGF0b3JTZXJ2aWNlKCk7XG4gICAgZmFzdGlmeS5kZWNvcmF0ZSgndmFsaWRhdG9yU2VydmljZScsIHZhbGlkYXRvclNlcnZpY2UpO1xuXG4gICAgY29uc3QgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoZmFzdGlmeSk7XG4gICAgZmFzdGlmeS5kZWNvcmF0ZSgndXNlclNlcnZpY2UnLCB1c2VyU2VydmljZSk7XG5cbiAgICBjb25zdCBhY2Nlc3NTZXJ2aWNlID0gbmV3IEFjY2Vzc1NlcnZpY2UoZmFzdGlmeSk7XG4gICAgZmFzdGlmeS5kZWNvcmF0ZSgnYWNjZXNzU2VydmljZScsIGFjY2Vzc1NlcnZpY2UpO1xuXG4gICAgY29uc3QgcmVmcmVzaFNlcnZpY2UgPSBuZXcgUmVmcmVzaFNlcnZpY2UoZmFzdGlmeSk7XG4gICAgZmFzdGlmeS5kZWNvcmF0ZSgncmVmcmVzaFNlcnZpY2UnLCByZWZyZXNoU2VydmljZSk7XG5cbiAgICBjb25zdCBhdXRoU2VydmljZSA9IG5ldyBBdXRoU2VydmljZShmYXN0aWZ5KTtcbiAgICBmYXN0aWZ5LmRlY29yYXRlKCdhdXRoU2VydmljZScsIGF1dGhTZXJ2aWNlKTtcblxuICAgIGNvbnN0IHN1YmplY3RTZXJ2aWNlID0gbmV3IFN1YmplY3RTZXJ2aWNlKCk7XG4gICAgZmFzdGlmeS5kZWNvcmF0ZSgnc3ViamVjdFNlcnZpY2UnLCBzdWJqZWN0U2VydmljZSk7XG5cbiAgICBjb25zdCBzdWJqZWN0Q29uZmlnU2VydmljZSA9IG5ldyBTdWJqZWN0Q29uZmlnU2VydmljZSgpO1xuICAgIGZhc3RpZnkuZGVjb3JhdGUoJ3N1YmplY3RDb25maWdTZXJ2aWNlJywgc3ViamVjdENvbmZpZ1NlcnZpY2UpO1xuXG4gICAgZmFzdGlmeS5kZWNvcmF0ZSgnYXV0aFByZUhhbmRsZXInLCBhc3luYyAoXG4gICAgICAgIHJlcTogRmFzdGlmeVJlcXVlc3Q8SW5jb21pbmdNZXNzYWdlPixcbiAgICAgICAgcmVwbHk6IEZhc3RpZnlSZXBseTxTZXJ2ZXJSZXNwb25zZT4sXG4gICAgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvKiogRXh0cmFjdCBhY2Nlc3MgdG9rZW4gZnJvbSBjb29raWVzICovXG4gICAgICAgICAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IHJlcS5jb29raWVzWydhY2Nlc3NUb2tlbiddO1xuXG4gICAgICAgICAgICAvKiogVmVyaWZ5IHRva2VuICovXG4gICAgICAgICAgICBjb25zdCB1c2VyUHJvZmlsZSA9IGF3YWl0IGZhc3RpZnkuYWNjZXNzU2VydmljZS52ZXJpZnlUb2tlbihhY2Nlc3NUb2tlbik7XG5cbiAgICAgICAgICAgIC8qKiBTZXQgdXNlciBkYXRhIHRvIHJlcSBib2R5ICovXG4gICAgICAgICAgICByZXEucGFyYW1zLnVzZXJQcm9maWxlID0gdXNlclByb2ZpbGU7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvKiogRXh0cmFjdCByZWZyZXNoIHRva2VuIGZyb20gY29va2llcyAqL1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlZnJlc2hUb2tlbiA9IHJlcS5jb29raWVzWydyZWZyZXNoVG9rZW4nXTtcblxuICAgICAgICAgICAgICAgIC8qKiBWZXJpZnkgdG9rZW4gKi9cbiAgICAgICAgICAgICAgICBjb25zdCB1c2VyUHJvZmlsZSA9IGF3YWl0IGZhc3RpZnkucmVmcmVzaFNlcnZpY2UudmVyaWZ5VG9rZW4ocmVmcmVzaFRva2VuKTtcblxuICAgICAgICAgICAgICAgIC8qKiBHZW5lcmF0ZSBuZXcgdG9rZW5zICovXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3QWNjZXNzVG9rZW4gPSBhd2FpdCBmYXN0aWZ5LmFjY2Vzc1NlcnZpY2UuZ2VuZXJhdGVUb2tlbihfLm9taXQodXNlclByb2ZpbGUsICdoYXNoJykpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1JlZnJlc2hUb2tlbiA9IGF3YWl0IGZhc3RpZnkucmVmcmVzaFNlcnZpY2UuZ2VuZXJhdGVUb2tlbih1c2VyUHJvZmlsZSk7XG5cbiAgICAgICAgICAgICAgICAvKiogU2V0IHByb2ZpbGUgdG8gcmVxIGJvZHkgKi9cbiAgICAgICAgICAgICAgICByZXEucGFyYW1zLnVzZXJQcm9maWxlID0gXy5vbWl0KHVzZXJQcm9maWxlLCAnaGFzaCcpO1xuXG4gICAgICAgICAgICAgICAgLyoqIFNldCBuZXcgdG9rZW5zIHBhaXIgdG8gY29va2llcyAqL1xuICAgICAgICAgICAgICAgIHJlcGx5XG4gICAgICAgICAgICAgICAgICAgIC5zZXRDb29raWUoJ2FjY2Vzc1Rva2VuJywgbmV3QWNjZXNzVG9rZW4sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heEFnZTogTnVtYmVyKGZhc3RpZnkuY29uZmlnLkpXVF9BQ0NFU1NfQ09PS0lFU19NQVhfQUdFKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0dHBPbmx5OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogJy8nLFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuc2V0Q29va2llKCdyZWZyZXNoVG9rZW4nLCBuZXdSZWZyZXNoVG9rZW4sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heEFnZTogTnVtYmVyKGZhc3RpZnkuY29uZmlnLkpXVF9SRUZSRVNIX0NPT0tJRVNfTUFYX0FHRSksXG4gICAgICAgICAgICAgICAgICAgICAgICBodHRwT25seTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6ICcvJyxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXBseS5zZW5kKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbmNvbnN0IGF1dGhlbnRpY2F0b3IgPSBhc3luYyAoZmFzdGlmeTogRmFzdGlmeUluc3RhbmNlKSA9PiB7XG4gICAgY29uc3Qgc2VjcmV0OiBzdHJpbmcgPSBwcm9jZXNzLmVudi5KV1RfU0VDUkVUIHx8ICdzdXBlcnNlY3JldCc7XG4gICAgZmFzdGlmeVxuICAgICAgICAucmVnaXN0ZXIoand0LCB7XG4gICAgICAgICAgICBzZWNyZXQsXG4gICAgICAgIH0pO1xufTtcblxuY29uc3QgZXJyb3JIYW5kbGVyID0gYXN5bmMgKGZhc3RpZnk6IEZhc3RpZnlJbnN0YW5jZSkgPT4ge1xuICAgIGZhc3RpZnkuc2V0RXJyb3JIYW5kbGVyKChlcnJvciwgcmVxLCByZXBseSkgPT4ge1xuICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzQ29kZSkge1xuICAgICAgICAgICAgcmVwbHlcbiAgICAgICAgICAgICAgICAuY29kZShlcnJvci5zdGF0dXNDb2RlKVxuICAgICAgICAgICAgICAgIC5zZW5kKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogZXJyb3Iuc3RhdHVzQ29kZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVxLmJvZHkuZXJyb3IsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXBseS5zZW5kKGVycm9yKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuY29uc3QgaW5zdGFuY2UgPSBmYXN0aWZ5KCk7XG5cbmluc3RhbmNlXG4gICAgLnJlZ2lzdGVyKGZhc3RpZnlDb3JzLCB7XG4gICAgICAgIG9yaWdpbjogWydodHRwOi8vbG9jYWxob3N0OjMwMDAnLCAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJ10sXG4gICAgICAgIGNyZWRlbnRpYWxzOiB0cnVlLFxuICAgIH0pXG4gICAgLnJlZ2lzdGVyKHJlcXVpcmUoJ2Zhc3RpZnktZW52JyksIHsgc2NoZW1hIH0pXG4gICAgLnJlZ2lzdGVyKGZwKGVycm9ySGFuZGxlcikpXG4gICAgLnJlZ2lzdGVyKGZwKGF1dGhlbnRpY2F0b3IpKVxuICAgIC5yZWdpc3RlcihmcChkZWNvcmF0ZUZhc3RpZnlJbnN0YW5jZSkpXG4gICAgLnJlZ2lzdGVyKGZhc3RpZnlGb3JtQm9keSlcbiAgICAucmVnaXN0ZXIoZmFzdGlmeUNvb2tpZSlcbiAgICAucmVnaXN0ZXIoKGluc3RhbmNlLCBvcHRzLCBuZXh0KSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZGUgPSBwcm9jZXNzLmVudi5OT0RFX0VOViB8fCAncHJvZHVjdGlvbic7XG5cbiAgICAgICAgY29uc3QgY2xpZW50UGF0aCA9IG1vZGUgPT09ICdkZXZlbG9wbWVudCdcbiAgICAgICAgICAgID8gJy4uLy4uL2NsaWVudC9wdWJsaWMnXG4gICAgICAgICAgICA6ICcuLi8uLi8uLi9jbGllbnQvYnVpbGQnO1xuXG4gICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyKHJlcXVpcmUoJ2Zhc3RpZnktc3RhdGljJyksIHtcbiAgICAgICAgICAgIHJvb3Q6IHBhdGguam9pbihfX2Rpcm5hbWUsIGNsaWVudFBhdGgpLFxuICAgICAgICAgICAgcHJlZml4OiAnLycsXG4gICAgICAgIH0pXG5cbiAgICAgICAgbmV4dCgpO1xuICAgIH0pXG4gICAgLnJlZ2lzdGVyKChpbnN0YW5jZSwgb3B0cywgbmV4dCkgPT4ge1xuICAgICAgICBpbnN0YW5jZS5yZWdpc3RlcihyZXF1aXJlKCdmYXN0aWZ5LXN0YXRpYycpLCB7XG4gICAgICAgICAgICByb290OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vcHVibGljJyksXG4gICAgICAgICAgICBwcmVmaXg6ICcvcHVibGljJyxcbiAgICAgICAgfSlcblxuICAgICAgICBuZXh0KCk7XG4gICAgfSlcbiAgICAucmVnaXN0ZXIoYXV0aENvbnRyb2xsZXIsIHsgcHJlZml4OiAnYXBpL2F1dGgvdXNlcicgfSlcbiAgICAucmVnaXN0ZXIoc3ViamVjdENvbnRyb2xsZXIsIHsgcHJlZml4OiAnYXBpL3N1YmplY3QnIH0pXG4gICAgLnJlZ2lzdGVyKHN1YmplY3RDb25maWdDb250cm9sbGVyLCB7IHByZWZpeDogJ2FwaS9zdWJqZWN0LWNvbmZpZycgfSk7XG5cbmV4cG9ydCB7IGluc3RhbmNlIH07XG4iXX0=