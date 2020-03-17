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
const mode = process.env.NODE_ENV || 'production';
const clientPath = mode === 'development'
    ? '../../client/public'
    : '../../../client/build';
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
    instance.register(require('fastify-static'), {
        root: path_1.default.join(__dirname, clientPath),
        prefix: '/',
    });
    // instance.get('/', async (req: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => {
    //     // reply.sendFile(path.join(__dirname, `${clientPath}/index.html`));
    //     reply.sendFile(path.resolve(__dirname, clientPath, ));
    // });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw2REFBNkQ7QUFDN0QsNEJBQTBCO0FBRTFCLHVCQUF1QjtBQUN2QixnREFBd0I7QUFDeEIsc0RBQWlHO0FBQ2pHLG9FQUFnQztBQUNoQyx3RUFBK0M7QUFDL0MsZ0VBQXVDO0FBQ3ZDLDhEQUE4QjtBQUM5QixvRUFBMkM7QUFHM0Msb0RBQXVCO0FBRXZCLDRCQUE0QjtBQUM1Qiw2RUFBb0Q7QUFDcEQscUVBQW9EO0FBQ3BELCtFQUFzRDtBQUN0RCxpRkFBd0Q7QUFDeEQsMkVBQWtEO0FBSWxELGtEQUFvQztBQUNwQyx3REFBMEM7QUFDMUMsb0VBQXNEO0FBQ3RELDZEQUF5QztBQUN6QyxnRUFBK0M7QUFDL0Msc0VBQTJEO0FBRTNELHdCQUF3QjtBQUN4QixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLFlBQVk7SUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFdEUsTUFBTSxNQUFNLEdBQUc7SUFDWCxJQUFJLEVBQUUsUUFBUTtJQUNkLFFBQVEsRUFBRTtRQUNOLFlBQVk7UUFDWix1QkFBdUI7UUFDdkIsNEJBQTRCO1FBQzVCLHdCQUF3QjtRQUN4Qiw2QkFBNkI7UUFDN0Isd0JBQXdCO0tBQzNCO0lBQ0QsVUFBVSxFQUFFO1FBQ1IsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtRQUM5QixxQkFBcUIsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7UUFDekMsMEJBQTBCLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO1FBQzlDLHNCQUFzQixFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtRQUMxQywyQkFBMkIsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7UUFDL0Msc0JBQXNCLEVBQUUsRUFBRSxJQUFJ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RTtJQUMvQixRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO1FBQ3pDLElBQUksRUFBRSxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUM7UUFDdkMsTUFBTSxFQUFFLFNBQVM7S0FDcEIsQ0FBQyxDQUFDO0lBRUgsSUFBSSxFQUFFLENBQUM7QUFDWCxDQUFDLENBQUM7S0FDRCxRQUFRLENBQUMsY0FBYyxFQUFFLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxDQUFDO0tBQ3JELFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsQ0FBQztLQUN0RCxRQUFRLENBQUMsdUJBQXVCLEVBQUUsRUFBRSxNQUFNLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gSW1wb3J0IHJlZmxlY3QgbWV0YWRhdGEgZm9yIGRlcGVuZGVuY3kgaW5qZWN0aW9uIG1lY2hhbmlzbVxuaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcblxuLyoqIEV4dGVybmFsIGltcG9ydHMgKi9cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZhc3RpZnksIHsgRmFzdGlmeUluc3RhbmNlLCBGYXN0aWZ5UmVxdWVzdCwgRmFzdGlmeVJlcGx5LCBTY2hlbWFDb21waWxlciB9IGZyb20gJ2Zhc3RpZnknO1xuaW1wb3J0IGZwIGZyb20gJ2Zhc3RpZnktcGx1Z2luJztcbmltcG9ydCBmYXN0aWZ5Rm9ybUJvZHkgZnJvbSAnZmFzdGlmeS1mb3JtYm9keSc7XG5pbXBvcnQgZmFzdGlmeUNvcnMgZnJvbSAnZmFzdGlmeS1jb3JzJztcbmltcG9ydCBqd3QgZnJvbSAnZmFzdGlmeS1qd3QnO1xuaW1wb3J0IGZhc3RpZnlDb29raWUgZnJvbSAnZmFzdGlmeS1jb29raWUnO1xuaW1wb3J0IGZhc3RpZnlTdGF0aWMgZnJvbSAnZmFzdGlmeS1zdGF0aWMnO1xuaW1wb3J0IHsgSW5jb21pbmdNZXNzYWdlLCBTZXJ2ZXJSZXNwb25zZSB9IGZyb20gJ2h0dHAnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuLyoqIEFwcGxpY2F0aW9uJ3MgaW1wb3J0cyAqL1xuaW1wb3J0IEJjcnlwdEhhc2hlciBmcm9tICcuL3NlcnZpY2VzL2JjcnlwdC1oYXNoZXInO1xuaW1wb3J0IFZhbGlkYXRvclNlcnZpY2UgZnJvbSAnLi9zZXJ2aWNlcy92YWxpZGF0b3InO1xuaW1wb3J0IEFjY2Vzc1NlcnZpY2UgZnJvbSAnLi9zZXJ2aWNlcy9hY2Nlc3Mtc2VydmljZSc7XG5pbXBvcnQgUmVmcmVzaFNlcnZpY2UgZnJvbSAnLi9zZXJ2aWNlcy9yZWZyZXNoLXNlcnZpY2UnO1xuaW1wb3J0IFVzZXJTZXJ2aWNlIGZyb20gJy4vc2VydmljZXMvdXNlci1zZXJ2aWNlJztcblxuaW1wb3J0IGp3dEFjY2VzcyBmcm9tICcuL3BsdWdpbnMvand0QWNjZXNzJztcblxuaW1wb3J0IGF1dGhDb250cm9sbGVyIGZyb20gJy4vYXV0aCc7XG5pbXBvcnQgc3ViamVjdENvbnRyb2xsZXIgZnJvbSAnLi9zdWJqZWN0JztcbmltcG9ydCBzdWJqZWN0Q29uZmlnQ29udHJvbGxlciBmcm9tICcuL3N1YmplY3RDb25maWcnO1xuaW1wb3J0IEF1dGhTZXJ2aWNlIGZyb20gJy4vYXV0aC9zZXJ2aWNlJztcbmltcG9ydCBTdWJqZWN0U2VydmljZSBmcm9tICcuL3N1YmplY3Qvc2VydmljZSc7XG5pbXBvcnQgU3ViamVjdENvbmZpZ1NlcnZpY2UgZnJvbSAnLi9zdWJqZWN0Q29uZmlnL3NlcnZpY2UnO1xuXG4vKiogSW1wb3J0IGVudiBjb25maWcgKi9cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSByZXF1aXJlKCdkb3RlbnYnKS5jb25maWcoKTtcblxuY29uc3Qgc2NoZW1hID0ge1xuICAgIHR5cGU6ICdvYmplY3QnLFxuICAgIHJlcXVpcmVkOiBbXG4gICAgICAgICdKV1RfU0VDUkVUJyxcbiAgICAgICAgJ0pXVF9BQ0NFU1NfRVhQSVJFU19JTicsXG4gICAgICAgICdKV1RfQUNDRVNTX0NPT0tJRVNfTUFYX0FHRScsXG4gICAgICAgICdKV1RfUkVGUkVTSF9FWFBJUkVTX0lOJyxcbiAgICAgICAgJ0pXVF9SRUZSRVNIX0NPT0tJRVNfTUFYX0FHRScsXG4gICAgICAgICdKV1RfU0VTU0lPTl9FWFBJUkVTX0lOJyxcbiAgICBdLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgSldUX1NFQ1JFVDogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICBKV1RfQUNDRVNTX0VYUElSRVNfSU46IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgSldUX0FDQ0VTU19DT09LSUVTX01BWF9BR0U6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgSldUX1JFRlJFU0hfRVhQSVJFU19JTjogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICBKV1RfUkVGUkVTSF9DT09LSUVTX01BWF9BR0U6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgSldUX1NFU1NJT05fRVhQSVJFU19JTjogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgIH0sXG59O1xuXG5jb25zdCBkZWNvcmF0ZUZhc3RpZnlJbnN0YW5jZSA9IGFzeW5jIChmYXN0aWZ5OiBGYXN0aWZ5SW5zdGFuY2UpID0+IHtcbiAgICBjb25zdCBiY3J5cHRIYXNoZXIgPSBuZXcgQmNyeXB0SGFzaGVyKCk7XG4gICAgZmFzdGlmeS5kZWNvcmF0ZSgnYmNyeXB0SGFzaGVyJywgYmNyeXB0SGFzaGVyKTtcblxuICAgIGNvbnN0IHZhbGlkYXRvclNlcnZpY2UgPSBuZXcgVmFsaWRhdG9yU2VydmljZSgpO1xuICAgIGZhc3RpZnkuZGVjb3JhdGUoJ3ZhbGlkYXRvclNlcnZpY2UnLCB2YWxpZGF0b3JTZXJ2aWNlKTtcblxuICAgIGNvbnN0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKGZhc3RpZnkpO1xuICAgIGZhc3RpZnkuZGVjb3JhdGUoJ3VzZXJTZXJ2aWNlJywgdXNlclNlcnZpY2UpO1xuXG4gICAgY29uc3QgYWNjZXNzU2VydmljZSA9IG5ldyBBY2Nlc3NTZXJ2aWNlKGZhc3RpZnkpO1xuICAgIGZhc3RpZnkuZGVjb3JhdGUoJ2FjY2Vzc1NlcnZpY2UnLCBhY2Nlc3NTZXJ2aWNlKTtcblxuICAgIGNvbnN0IHJlZnJlc2hTZXJ2aWNlID0gbmV3IFJlZnJlc2hTZXJ2aWNlKGZhc3RpZnkpO1xuICAgIGZhc3RpZnkuZGVjb3JhdGUoJ3JlZnJlc2hTZXJ2aWNlJywgcmVmcmVzaFNlcnZpY2UpO1xuXG4gICAgY29uc3QgYXV0aFNlcnZpY2UgPSBuZXcgQXV0aFNlcnZpY2UoZmFzdGlmeSk7XG4gICAgZmFzdGlmeS5kZWNvcmF0ZSgnYXV0aFNlcnZpY2UnLCBhdXRoU2VydmljZSk7XG5cbiAgICBjb25zdCBzdWJqZWN0U2VydmljZSA9IG5ldyBTdWJqZWN0U2VydmljZSgpO1xuICAgIGZhc3RpZnkuZGVjb3JhdGUoJ3N1YmplY3RTZXJ2aWNlJywgc3ViamVjdFNlcnZpY2UpO1xuXG4gICAgY29uc3Qgc3ViamVjdENvbmZpZ1NlcnZpY2UgPSBuZXcgU3ViamVjdENvbmZpZ1NlcnZpY2UoKTtcbiAgICBmYXN0aWZ5LmRlY29yYXRlKCdzdWJqZWN0Q29uZmlnU2VydmljZScsIHN1YmplY3RDb25maWdTZXJ2aWNlKTtcblxuICAgIGZhc3RpZnkuZGVjb3JhdGUoJ2F1dGhQcmVIYW5kbGVyJywgYXN5bmMgKFxuICAgICAgICByZXE6IEZhc3RpZnlSZXF1ZXN0PEluY29taW5nTWVzc2FnZT4sXG4gICAgICAgIHJlcGx5OiBGYXN0aWZ5UmVwbHk8U2VydmVyUmVzcG9uc2U+LFxuICAgICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLyoqIEV4dHJhY3QgYWNjZXNzIHRva2VuIGZyb20gY29va2llcyAqL1xuICAgICAgICAgICAgY29uc3QgYWNjZXNzVG9rZW4gPSByZXEuY29va2llc1snYWNjZXNzVG9rZW4nXTtcblxuICAgICAgICAgICAgLyoqIFZlcmlmeSB0b2tlbiAqL1xuICAgICAgICAgICAgY29uc3QgdXNlclByb2ZpbGUgPSBhd2FpdCBmYXN0aWZ5LmFjY2Vzc1NlcnZpY2UudmVyaWZ5VG9rZW4oYWNjZXNzVG9rZW4pO1xuXG4gICAgICAgICAgICAvKiogU2V0IHVzZXIgZGF0YSB0byByZXEgYm9keSAqL1xuICAgICAgICAgICAgcmVxLnBhcmFtcy51c2VyUHJvZmlsZSA9IHVzZXJQcm9maWxlO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgLyoqIEV4dHJhY3QgcmVmcmVzaCB0b2tlbiBmcm9tIGNvb2tpZXMgKi9cbiAgICAgICAgICAgICAgICBjb25zdCByZWZyZXNoVG9rZW4gPSByZXEuY29va2llc1sncmVmcmVzaFRva2VuJ107XG5cbiAgICAgICAgICAgICAgICAvKiogVmVyaWZ5IHRva2VuICovXG4gICAgICAgICAgICAgICAgY29uc3QgdXNlclByb2ZpbGUgPSBhd2FpdCBmYXN0aWZ5LnJlZnJlc2hTZXJ2aWNlLnZlcmlmeVRva2VuKHJlZnJlc2hUb2tlbik7XG5cbiAgICAgICAgICAgICAgICAvKiogR2VuZXJhdGUgbmV3IHRva2VucyAqL1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0FjY2Vzc1Rva2VuID0gYXdhaXQgZmFzdGlmeS5hY2Nlc3NTZXJ2aWNlLmdlbmVyYXRlVG9rZW4oXy5vbWl0KHVzZXJQcm9maWxlLCAnaGFzaCcpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdSZWZyZXNoVG9rZW4gPSBhd2FpdCBmYXN0aWZ5LnJlZnJlc2hTZXJ2aWNlLmdlbmVyYXRlVG9rZW4odXNlclByb2ZpbGUpO1xuXG4gICAgICAgICAgICAgICAgLyoqIFNldCBwcm9maWxlIHRvIHJlcSBib2R5ICovXG4gICAgICAgICAgICAgICAgcmVxLnBhcmFtcy51c2VyUHJvZmlsZSA9IF8ub21pdCh1c2VyUHJvZmlsZSwgJ2hhc2gnKTtcblxuICAgICAgICAgICAgICAgIC8qKiBTZXQgbmV3IHRva2VucyBwYWlyIHRvIGNvb2tpZXMgKi9cbiAgICAgICAgICAgICAgICByZXBseVxuICAgICAgICAgICAgICAgICAgICAuc2V0Q29va2llKCdhY2Nlc3NUb2tlbicsIG5ld0FjY2Vzc1Rva2VuLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhBZ2U6IE51bWJlcihmYXN0aWZ5LmNvbmZpZy5KV1RfQUNDRVNTX0NPT0tJRVNfTUFYX0FHRSksXG4gICAgICAgICAgICAgICAgICAgICAgICBodHRwT25seTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6ICcvJyxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnNldENvb2tpZSgncmVmcmVzaFRva2VuJywgbmV3UmVmcmVzaFRva2VuLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhBZ2U6IE51bWJlcihmYXN0aWZ5LmNvbmZpZy5KV1RfUkVGUkVTSF9DT09LSUVTX01BWF9BR0UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaHR0cE9ubHk6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiAnLycsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVwbHkuc2VuZChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5jb25zdCBhdXRoZW50aWNhdG9yID0gYXN5bmMgKGZhc3RpZnk6IEZhc3RpZnlJbnN0YW5jZSkgPT4ge1xuICAgIGNvbnN0IHNlY3JldDogc3RyaW5nID0gcHJvY2Vzcy5lbnYuSldUX1NFQ1JFVCB8fCAnc3VwZXJzZWNyZXQnO1xuICAgIGZhc3RpZnlcbiAgICAgICAgLnJlZ2lzdGVyKGp3dCwge1xuICAgICAgICAgICAgc2VjcmV0LFxuICAgICAgICB9KTtcbn07XG5cbmNvbnN0IGVycm9ySGFuZGxlciA9IGFzeW5jIChmYXN0aWZ5OiBGYXN0aWZ5SW5zdGFuY2UpID0+IHtcbiAgICBmYXN0aWZ5LnNldEVycm9ySGFuZGxlcigoZXJyb3IsIHJlcSwgcmVwbHkpID0+IHtcbiAgICAgICAgaWYgKGVycm9yLnN0YXR1c0NvZGUpIHtcbiAgICAgICAgICAgIHJlcGx5XG4gICAgICAgICAgICAgICAgLmNvZGUoZXJyb3Iuc3RhdHVzQ29kZSlcbiAgICAgICAgICAgICAgICAuc2VuZCh7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IGVycm9yLnN0YXR1c0NvZGUsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHJlcS5ib2R5LmVycm9yLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVwbHkuc2VuZChlcnJvcik7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbmNvbnN0IGluc3RhbmNlID0gZmFzdGlmeSgpO1xuXG5jb25zdCBtb2RlID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgfHwgJ3Byb2R1Y3Rpb24nO1xuXG5jb25zdCBjbGllbnRQYXRoID0gbW9kZSA9PT0gJ2RldmVsb3BtZW50J1xuICAgID8gJy4uLy4uL2NsaWVudC9wdWJsaWMnXG4gICAgOiAnLi4vLi4vLi4vY2xpZW50L2J1aWxkJztcblxuaW5zdGFuY2VcbiAgICAucmVnaXN0ZXIoZmFzdGlmeUNvcnMsIHtcbiAgICAgICAgb3JpZ2luOiBbJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcsICdodHRwOi8vbG9jYWxob3N0OjgwODAnXSxcbiAgICAgICAgY3JlZGVudGlhbHM6IHRydWUsXG4gICAgfSlcbiAgICAucmVnaXN0ZXIocmVxdWlyZSgnZmFzdGlmeS1lbnYnKSwgeyBzY2hlbWEgfSlcbiAgICAucmVnaXN0ZXIoZnAoZXJyb3JIYW5kbGVyKSlcbiAgICAucmVnaXN0ZXIoZnAoYXV0aGVudGljYXRvcikpXG4gICAgLnJlZ2lzdGVyKGZwKGRlY29yYXRlRmFzdGlmeUluc3RhbmNlKSlcbiAgICAucmVnaXN0ZXIoZmFzdGlmeUZvcm1Cb2R5KVxuICAgIC5yZWdpc3RlcihmYXN0aWZ5Q29va2llKVxuICAgIC5yZWdpc3RlcigoaW5zdGFuY2UsIG9wdHMsIG5leHQpID0+IHtcbiAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXIocmVxdWlyZSgnZmFzdGlmeS1zdGF0aWMnKSwge1xuICAgICAgICAgICAgcm9vdDogcGF0aC5qb2luKF9fZGlybmFtZSwgY2xpZW50UGF0aCksXG4gICAgICAgICAgICBwcmVmaXg6ICcvJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gaW5zdGFuY2UuZ2V0KCcvJywgYXN5bmMgKHJlcTogRmFzdGlmeVJlcXVlc3Q8SW5jb21pbmdNZXNzYWdlPiwgcmVwbHk6IEZhc3RpZnlSZXBseTxTZXJ2ZXJSZXNwb25zZT4pID0+IHtcbiAgICAgICAgLy8gICAgIC8vIHJlcGx5LnNlbmRGaWxlKHBhdGguam9pbihfX2Rpcm5hbWUsIGAke2NsaWVudFBhdGh9L2luZGV4Lmh0bWxgKSk7XG4gICAgICAgIC8vICAgICByZXBseS5zZW5kRmlsZShwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBjbGllbnRQYXRoLCApKTtcbiAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgbmV4dCgpO1xuICAgIH0pXG4gICAgLnJlZ2lzdGVyKChpbnN0YW5jZSwgb3B0cywgbmV4dCkgPT4ge1xuICAgICAgICBpbnN0YW5jZS5yZWdpc3RlcihyZXF1aXJlKCdmYXN0aWZ5LXN0YXRpYycpLCB7XG4gICAgICAgICAgICByb290OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vcHVibGljJyksXG4gICAgICAgICAgICBwcmVmaXg6ICcvcHVibGljJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbmV4dCgpO1xuICAgIH0pXG4gICAgLnJlZ2lzdGVyKGF1dGhDb250cm9sbGVyLCB7IHByZWZpeDogJ2FwaS9hdXRoL3VzZXInIH0pXG4gICAgLnJlZ2lzdGVyKHN1YmplY3RDb250cm9sbGVyLCB7IHByZWZpeDogJ2FwaS9zdWJqZWN0JyB9KVxuICAgIC5yZWdpc3RlcihzdWJqZWN0Q29uZmlnQ29udHJvbGxlciwgeyBwcmVmaXg6ICdhcGkvc3ViamVjdC1jb25maWcnIH0pO1xuXG5leHBvcnQgeyBpbnN0YW5jZSB9O1xuIl19