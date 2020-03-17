"use strict";
/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 8 March 2020
 *
 */
/** Application's imports */
const prisma_client_1 = require("../../prisma/generated/prisma-client");
const error_handler_1 = require("../services/error-handler");
const schema_1 = require("./schema");
async function signupHandler(fastify, req, reply) {
    const credentials = req.body;
    try {
        /** Validate credentials */
        await fastify.validatorService.validateSignUpCredentials(credentials);
        /** Hash password */
        credentials.password = await fastify.bcryptHasher.hashPassword(credentials.password);
        /** Get created user */
        const user = await prisma_client_1.prisma.createUser({
            ...credentials,
            role: 'DEFAULT_USER',
        });
        /** Delete password */
        delete user.password;
        return { ...user };
    }
    catch (err) {
        const error = error_handler_1.errorHandler(err);
        /** Set additional data to req body to prevent getting the 500 error */
        req.body.error = error.data;
        reply.send(err);
    }
}
async function signinHandler(fastify, req, reply) {
    /** Extract credentials */
    const credentials = req.body;
    try {
        const user = await fastify.userService.verifyCredentials(credentials);
        const userProfile = fastify.userService.convertToUserProfile(user);
        const accessToken = await fastify.accessService.generateToken(userProfile);
        const refreshToken = await fastify.refreshService.generateToken(userProfile);
        reply
            .setCookie('accessToken', accessToken, {
            maxAge: credentials.remember
                ? Number(fastify.config.JWT_ACCESS_COOKIES_MAX_AGE)
                : undefined,
            httpOnly: true,
            path: '/',
        })
            .setCookie('refreshToken', refreshToken, {
            maxAge: credentials.remember
                ? Number(fastify.config.JWT_REFRESH_COOKIES_MAX_AGE)
                : undefined,
            httpOnly: true,
            path: '/',
        })
            .send(user);
    }
    catch (err) {
        const error = error_handler_1.errorHandler(err);
        /** Set additional data to req body to prevent getting the 500 error */
        req.body.error = error.data;
        reply.send(err);
    }
}
async function meHandler(req, reply) {
    try {
        const user = req.params.userProfile;
        return { ...user };
    }
    catch (err) {
        const error = error_handler_1.errorHandler(err);
        reply.send({ ...error });
    }
}
async function refreshHandler(fastify, req, reply) {
    try {
        const { accessToken, refreshToken, userProfile } = await fastify.authService.refresh(req);
        reply
            .setCookie('accessToken', accessToken, {
            maxAge: Number(fastify.config.JWT_ACCESS_COOKIES_MAX_AGE),
            httpOnly: true,
            path: '/',
        })
            .setCookie('refreshToken', refreshToken, {
            maxAge: Number(fastify.config.JWT_REFRESH_COOKIES_MAX_AGE),
            httpOnly: true,
            path: '/',
        })
            .send(userProfile);
    }
    catch (err) {
        reply.send(err);
    }
}
async function logoutHandler(fastify, req, reply) {
    try {
        await fastify.authService.logout(req);
        reply
            .clearCookie('accessToken', {
            httpOnly: true,
            path: '/',
        })
            .clearCookie('refreshToken', {
            httpOnly: true,
            path: '/',
        })
            .code(200)
            .send('Success');
    }
    catch (err) {
        reply.send(err);
    }
}
module.exports = async function (fastify, opts) {
    fastify.post('/signup', { schema: schema_1.signup }, async (req, reply) => await signupHandler(fastify, req, reply));
    fastify.post('/signin', { schema: schema_1.signin }, async (req, reply) => await signinHandler(fastify, req, reply));
    fastify.get('/refresh', async (req, reply) => await refreshHandler(fastify, req, reply));
    fastify.post('/logout', async (req, reply) => await logoutHandler(fastify, req, reply));
    fastify.register(async (fastify) => {
        fastify.addHook('preHandler', async (req, reply) => {
            await fastify.authPreHandler(req, reply);
            return;
        });
        fastify.get('/me', { schema: schema_1.me }, meHandler);
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYXV0aC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRztBQU1ILDRCQUE0QjtBQUM1Qix3RUFBb0U7QUFFcEUsNkRBQXlEO0FBRXpELHFDQUlrQjtBQW9EbEIsS0FBSyxVQUFVLGFBQWEsQ0FDeEIsT0FBd0IsRUFDeEIsR0FBb0MsRUFDcEMsS0FBbUM7SUFFbkMsTUFBTSxXQUFXLEdBQXVCLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFFakQsSUFBSTtRQUNBLDJCQUEyQjtRQUMzQixNQUFNLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyx5QkFBeUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUV0RSxvQkFBb0I7UUFDcEIsV0FBVyxDQUFDLFFBQVEsR0FBRyxNQUFNLE9BQU8sQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVyRix1QkFBdUI7UUFDdkIsTUFBTSxJQUFJLEdBQUcsTUFBTSxzQkFBTSxDQUFDLFVBQVUsQ0FBQztZQUNqQyxHQUFHLFdBQVc7WUFDZCxJQUFJLEVBQUUsY0FBYztTQUN2QixDQUFDLENBQUM7UUFFSCxzQkFBc0I7UUFDdEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBRXJCLE9BQU8sRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO0tBQ3RCO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDVixNQUFNLEtBQUssR0FBRyw0QkFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLHVFQUF1RTtRQUN2RSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQzVCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDbkI7QUFDTCxDQUFDO0FBRUQsS0FBSyxVQUFVLGFBQWEsQ0FDeEIsT0FBd0IsRUFDeEIsR0FBb0MsRUFDcEMsS0FB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LEtBQW1DLEVBQ3JDLEVBQUUsQ0FBQyxNQUFNLGNBQWMsQ0FDckIsT0FBTyxFQUNQLEdBQUcsRUFDSCxLQUFLLENBQ1IsQ0FBQyxDQUFDO0lBRUgsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUN6QixHQUFvQyxFQUNwQyxLQUFtQyxFQUNyQyxFQUFFLENBQUMsTUFBTSxhQUFhLENBQ3BCLE9BQU8sRUFDUCxHQUFHLEVBQ0gsS0FBSyxDQUNSLENBQUMsQ0FBQztJQUVILE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLE9BQXdCLEVBQUUsRUFBRTtRQUNoRCxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxLQUFLLEVBQy9CLEdBQW9DLEVBQ3BDLEtBQW1DLEVBQ3JDLEVBQUU7WUFDQSxNQUFNLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3pDLE9BQU87UUFDWCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLFdBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ2xELENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5OiBPbGVrc2FuZHIgQmV6cnVrb3ZcbiAqIENyZWF0aW9uIGRhdGU6IDggTWFyY2ggMjAyMFxuICpcbiAqL1xuXG4vKiogRXh0ZXJuYWwgaW1wb3J0cyAqL1xuaW1wb3J0IHsgRmFzdGlmeVJlcXVlc3QsIEZhc3RpZnlSZXBseSwgRmFzdGlmeUluc3RhbmNlIH0gZnJvbSBcImZhc3RpZnlcIjtcbmltcG9ydCB7IEluY29taW5nTWVzc2FnZSwgU2VydmVyUmVzcG9uc2UgfSBmcm9tIFwiaHR0cFwiO1xuXG4vKiogQXBwbGljYXRpb24ncyBpbXBvcnRzICovXG5pbXBvcnQgeyBwcmlzbWEsIFVzZXIgfSBmcm9tICcuLi8uLi9wcmlzbWEvZ2VuZXJhdGVkL3ByaXNtYS1jbGllbnQnO1xuaW1wb3J0IHsgSVNpZ25VcENyZWRlbnRpYWxzLCBJU2lnbkluQ3JlZGVudGlhbHMsIFVzZXJQcm9maWxlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL3R5cGVzXCI7XG5pbXBvcnQgeyBlcnJvckhhbmRsZXIgfSBmcm9tICcuLi9zZXJ2aWNlcy9lcnJvci1oYW5kbGVyJztcbmltcG9ydCB7IElSZWZyZXNoUmV0dXJuRGF0YSB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQge1xuICAgIG1lLFxuICAgIHNpZ25pbixcbiAgICBzaWdudXAsXG59IGZyb20gJy4vc2NoZW1hJztcblxuZXhwb3J0ID0gYXN5bmMgZnVuY3Rpb24gKFxuICAgIGZhc3RpZnk6IEZhc3RpZnlJbnN0YW5jZSxcbiAgICBvcHRzOiBhbnksXG4pIHtcbiAgICBmYXN0aWZ5LnBvc3QoJy9zaWdudXAnLCB7IHNjaGVtYTogc2lnbnVwIH0sIGFzeW5jIChcbiAgICAgICAgcmVxOiBGYXN0aWZ5UmVxdWVzdDxJbmNvbWluZ01lc3NhZ2U+LFxuICAgICAgICByZXBseTogRmFzdGlmeVJlcGx5PFNlcnZlclJlc3BvbnNlPixcbiAgICApID0+IGF3YWl0IHNpZ251cEhhbmRsZXIoXG4gICAgICAgIGZhc3RpZnksXG4gICAgICAgIHJlcSxcbiAgICAgICAgcmVwbHksXG4gICAgKSk7XG4gICAgZmFzdGlmeS5wb3N0KCcvc2lnbmluJywgeyBzY2hlbWE6IHNpZ25pbiB9LCBhc3luYyAoXG4gICAgICAgIHJlcTogRmFzdGlmeVJlcXVlc3Q8SW5jb21pbmdNZXNzYWdlPixcbiAgICAgICAgcmVwbHk6IEZhc3RpZnlSZXBseTxTZXJ2ZXJSZXNwb25zZT4sXG4gICAgKSA9PiBhd2FpdCBzaWduaW5IYW5kbGVyKFxuICAgICAgICBmYXN0aWZ5LFxuICAgICAgICByZXEsXG4gICAgICAgIHJlcGx5LFxuICAgICkpO1xuICAgIGZhc3RpZnkuZ2V0KCcvcmVmcmVzaCcsIGFzeW5jIChcbiAgICAgICAgcmVxOiBGYXN0aWZ5UmVxdWVzdDxJbmNvbWluZ01lc3NhZ2U+LFxuICAgICAgICByZXBseTogRmFzdGlmeVJlcGx5PFNlcnZlclJlc3BvbnNlPixcbiAgICApID0+IGF3YWl0IHJlZnJlc2hIYW5kbGVyKFxuICAgICAgICBmYXN0aWZ5LFxuICAgICAgICByZXEsXG4gICAgICAgIHJlcGx5LFxuICAgICkpO1xuXG4gICAgZmFzdGlmeS5wb3N0KCcvbG9nb3V0JywgYXN5bmMgKFxuICAgICAgICByZXE6IEZhc3RpZnlSZXF1ZXN0PEluY29taW5nTWVzc2FnZT4sXG4gICAgICAgIHJlcGx5OiBGYXN0aWZ5UmVwbHk8U2VydmVyUmVzcG9uc2U+LFxuICAgICkgPT4gYXdhaXQgbG9nb3V0SGFuZGxlcihcbiAgICAgICAgZmFzdGlmeSxcbiAgICAgICAgcmVxLFxuICAgICAgICByZXBseSxcbiAgICApKTtcblxuICAgIGZhc3RpZnkucmVnaXN0ZXIoYXN5bmMgKGZhc3RpZnk6IEZhc3RpZnlJbnN0YW5jZSkgPT4ge1xuICAgICAgICBmYXN0aWZ5LmFkZEhvb2soJ3ByZUhhbmRsZXInLCBhc3luYyAoXG4gICAgICAgICAgICByZXE6IEZhc3RpZnlSZXF1ZXN0PEluY29taW5nTWVzc2FnZT4sXG4gICAgICAgICAgICByZXBseTogRmFzdGlmeVJlcGx5PFNlcnZlclJlc3BvbnNlPixcbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCBmYXN0aWZ5LmF1dGhQcmVIYW5kbGVyKHJlcSwgcmVwbHkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9KTtcbiAgICAgICAgZmFzdGlmeS5nZXQoJy9tZScsIHsgc2NoZW1hOiBtZSB9LCBtZUhhbmRsZXIpO1xuICAgIH0pO1xufTtcblxuYXN5bmMgZnVuY3Rpb24gc2lnbnVwSGFuZGxlcihcbiAgICBmYXN0aWZ5OiBGYXN0aWZ5SW5zdGFuY2UsXG4gICAgcmVxOiBGYXN0aWZ5UmVxdWVzdDxJbmNvbWluZ01lc3NhZ2U+LFxuICAgIHJlcGx5OiBGYXN0aWZ5UmVwbHk8U2VydmVyUmVzcG9uc2U+LFxuKSB7XG4gICAgY29uc3QgY3JlZGVudGlhbHM6IElTaWduVXBDcmVkZW50aWFscyA9IHJlcS5ib2R5O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgLyoqIFZhbGlkYXRlIGNyZWRlbnRpYWxzICovXG4gICAgICAgIGF3YWl0IGZhc3RpZnkudmFsaWRhdG9yU2VydmljZS52YWxpZGF0ZVNpZ25VcENyZWRlbnRpYWxzKGNyZWRlbnRpYWxzKTtcblxuICAgICAgICAvKiogSGFzaCBwYXNzd29yZCAqL1xuICAgICAgICBjcmVkZW50aWFscy5wYXNzd29yZCA9IGF3YWl0IGZhc3RpZnkuYmNyeXB0SGFzaGVyLmhhc2hQYXNzd29yZChjcmVkZW50aWFscy5wYXNzd29yZCk7XG5cbiAgICAgICAgLyoqIEdldCBjcmVhdGVkIHVzZXIgKi9cbiAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IHByaXNtYS5jcmVhdGVVc2VyKHtcbiAgICAgICAgICAgIC4uLmNyZWRlbnRpYWxzLFxuICAgICAgICAgICAgcm9sZTogJ0RFRkFVTFRfVVNFUicsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKiBEZWxldGUgcGFzc3dvcmQgKi9cbiAgICAgICAgZGVsZXRlIHVzZXIucGFzc3dvcmQ7XG5cbiAgICAgICAgcmV0dXJuIHsgLi4udXNlciB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zdCBlcnJvciA9IGVycm9ySGFuZGxlcihlcnIpO1xuICAgICAgICAvKiogU2V0IGFkZGl0aW9uYWwgZGF0YSB0byByZXEgYm9keSB0byBwcmV2ZW50IGdldHRpbmcgdGhlIDUwMCBlcnJvciAqL1xuICAgICAgICByZXEuYm9keS5lcnJvciA9IGVycm9yLmRhdGE7XG4gICAgICAgIHJlcGx5LnNlbmQoZXJyKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNpZ25pbkhhbmRsZXIoXG4gICAgZmFzdGlmeTogRmFzdGlmeUluc3RhbmNlLFxuICAgIHJlcTogRmFzdGlmeVJlcXVlc3Q8SW5jb21pbmdNZXNzYWdlPixcbiAgICByZXBseTogRmFzdGlmeVJlcGx5PFNlcnZlclJlc3BvbnNlPixcbikge1xuICAgIC8qKiBFeHRyYWN0IGNyZWRlbnRpYWxzICovXG4gICAgY29uc3QgY3JlZGVudGlhbHM6IElTaWduSW5DcmVkZW50aWFscyA9IHJlcS5ib2R5O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdXNlcjogT21pdDxVc2VyLCAncGFzc3dvcmQnPiA9IGF3YWl0IGZhc3RpZnkudXNlclNlcnZpY2UudmVyaWZ5Q3JlZGVudGlhbHMoY3JlZGVudGlhbHMpO1xuXG4gICAgICAgIGNvbnN0IHVzZXJQcm9maWxlOiBVc2VyUHJvZmlsZSA9IGZhc3RpZnkudXNlclNlcnZpY2UuY29udmVydFRvVXNlclByb2ZpbGUodXNlcik7XG5cbiAgICAgICAgY29uc3QgYWNjZXNzVG9rZW46IHN0cmluZyA9IGF3YWl0IGZhc3RpZnkuYWNjZXNzU2VydmljZS5nZW5lcmF0ZVRva2VuKHVzZXJQcm9maWxlKTtcblxuICAgICAgICBjb25zdCByZWZyZXNoVG9rZW46IHN0cmluZyA9IGF3YWl0IGZhc3RpZnkucmVmcmVzaFNlcnZpY2UuZ2VuZXJhdGVUb2tlbih1c2VyUHJvZmlsZSk7XG5cbiAgICAgICAgcmVwbHlcbiAgICAgICAgICAgIC5zZXRDb29raWUoJ2FjY2Vzc1Rva2VuJywgYWNjZXNzVG9rZW4sIHtcbiAgICAgICAgICAgICAgICBtYXhBZ2U6IGNyZWRlbnRpYWxzLnJlbWVtYmVyXG4gICAgICAgICAgICAgICAgICAgID8gTnVtYmVyKGZhc3RpZnkuY29uZmlnLkpXVF9BQ0NFU1NfQ09PS0lFU19NQVhfQUdFKVxuICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBodHRwT25seTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwYXRoOiAnLycsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnNldENvb2tpZSgncmVmcmVzaFRva2VuJywgcmVmcmVzaFRva2VuLCB7XG4gICAgICAgICAgICAgICAgbWF4QWdlOiBjcmVkZW50aWFscy5yZW1lbWJlclxuICAgICAgICAgICAgICAgICAgICA/IE51bWJlcihmYXN0aWZ5LmNvbmZpZy5KV1RfUkVGUkVTSF9DT09LSUVTX01BWF9BR0UpXG4gICAgICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGh0dHBPbmx5OiB0cnVlLFxuICAgICAgICAgICAgICAgIHBhdGg6ICcvJyxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc2VuZCh1c2VyKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBlcnJvckhhbmRsZXIoZXJyKTtcbiAgICAgICAgLyoqIFNldCBhZGRpdGlvbmFsIGRhdGEgdG8gcmVxIGJvZHkgdG8gcHJldmVudCBnZXR0aW5nIHRoZSA1MDAgZXJyb3IgKi9cbiAgICAgICAgcmVxLmJvZHkuZXJyb3IgPSBlcnJvci5kYXRhO1xuICAgICAgICByZXBseS5zZW5kKGVycik7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBtZUhhbmRsZXIoXG4gICAgcmVxOiBGYXN0aWZ5UmVxdWVzdDxJbmNvbWluZ01lc3NhZ2U+LFxuICAgIHJlcGx5OiBGYXN0aWZ5UmVwbHk8U2VydmVyUmVzcG9uc2U+LFxuKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdXNlciA9IHJlcS5wYXJhbXMudXNlclByb2ZpbGU7XG5cbiAgICAgICAgcmV0dXJuIHsgLi4udXNlciB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zdCBlcnJvciA9IGVycm9ySGFuZGxlcihlcnIpO1xuICAgICAgICByZXBseS5zZW5kKHsgLi4uZXJyb3IgfSk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiByZWZyZXNoSGFuZGxlcihcbiAgICBmYXN0aWZ5OiBGYXN0aWZ5SW5zdGFuY2UsXG4gICAgcmVxOiBGYXN0aWZ5UmVxdWVzdDxJbmNvbWluZ01lc3NhZ2U+LFxuICAgIHJlcGx5OiBGYXN0aWZ5UmVwbHk8U2VydmVyUmVzcG9uc2U+LFxuKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBhY2Nlc3NUb2tlbiwgcmVmcmVzaFRva2VuLCB1c2VyUHJvZmlsZSB9OiBJUmVmcmVzaFJldHVybkRhdGEgPSBhd2FpdCBmYXN0aWZ5LmF1dGhTZXJ2aWNlLnJlZnJlc2gocmVxKTtcblxuICAgICAgICByZXBseVxuICAgICAgICAgICAgLnNldENvb2tpZSgnYWNjZXNzVG9rZW4nLCBhY2Nlc3NUb2tlbiwge1xuICAgICAgICAgICAgICAgIG1heEFnZTogTnVtYmVyKGZhc3RpZnkuY29uZmlnLkpXVF9BQ0NFU1NfQ09PS0lFU19NQVhfQUdFKSxcbiAgICAgICAgICAgICAgICBodHRwT25seTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwYXRoOiAnLycsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnNldENvb2tpZSgncmVmcmVzaFRva2VuJywgcmVmcmVzaFRva2VuLCB7XG4gICAgICAgICAgICAgICAgbWF4QWdlOiBOdW1iZXIoZmFzdGlmeS5jb25maWcuSldUX1JFRlJFU0hfQ09PS0lFU19NQVhfQUdFKSxcbiAgICAgICAgICAgICAgICBodHRwT25seTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwYXRoOiAnLycsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnNlbmQodXNlclByb2ZpbGUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXBseS5zZW5kKGVycik7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBsb2dvdXRIYW5kbGVyKFxuICAgIGZhc3RpZnk6IEZhc3RpZnlJbnN0YW5jZSxcbiAgICByZXE6IEZhc3RpZnlSZXF1ZXN0PEluY29taW5nTWVzc2FnZT4sXG4gICAgcmVwbHk6IEZhc3RpZnlSZXBseTxTZXJ2ZXJSZXNwb25zZT4sXG4pIHtcbiAgICB0cnkge1xuICAgICAgICBhd2FpdCBmYXN0aWZ5LmF1dGhTZXJ2aWNlLmxvZ291dChyZXEpO1xuXG4gICAgICAgIHJlcGx5XG4gICAgICAgICAgICAuY2xlYXJDb29raWUoJ2FjY2Vzc1Rva2VuJywge1xuICAgICAgICAgICAgICAgIGh0dHBPbmx5OiB0cnVlLFxuICAgICAgICAgICAgICAgIHBhdGg6ICcvJyxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2xlYXJDb29raWUoJ3JlZnJlc2hUb2tlbicsIHtcbiAgICAgICAgICAgICAgICBodHRwT25seTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwYXRoOiAnLycsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNvZGUoMjAwKVxuICAgICAgICAgICAgLnNlbmQoJ1N1Y2Nlc3MnKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmVwbHkuc2VuZChlcnIpO1xuICAgIH1cbn1cbiJdfQ==