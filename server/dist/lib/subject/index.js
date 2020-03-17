"use strict";
/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * Subject controller which handles api requests.
 */
const createHandler = async (fastify, req, reply) => {
    /** Extract data from request body */
    const name = req.body.name;
    try {
        const subject = await fastify.subjectService.create(name);
        return subject;
    }
    catch (err) {
        reply.send(err);
    }
};
const subjectsHandler = async (fastify, req, reply) => {
    try {
        const subjects = await fastify.subjectService.subjects();
        return subjects;
    }
    catch (err) {
        reply.send(err);
    }
};
module.exports = async function (fastify, opts) {
    fastify.register(async (fastify) => {
        fastify.addHook('preHandler', async (req, reply) => {
            await fastify.authPreHandler(req, reply);
            return;
        });
        fastify.post('/create', async (req, reply) => await createHandler(fastify, req, reply));
    });
    fastify.get('/subjects', async (req, reply) => await subjectsHandler(fastify, req, reply));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvc3ViamVjdC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7O0dBS0c7QUFpQ0gsTUFBTSxhQUFhLEdBQUcsS0FBSyxFQUN2QixPQUF3QixFQUN4QixHQUFvQyxFQUNwQyxLQUFtQyxFQUNyQyxFQUFFO0lBQ0EscUNBQXFDO0lBQ3JDLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBRTNCLElBQUk7UUFDQSxNQUFNLE9BQU8sR0FBRyxNQUFNLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTFELE9BQU8sT0FBTyxDQUFDO0tBQ2xCO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDVixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ25CO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsTUFBTSxlQUFlLEdBQUcsS0FBSyxFQUN6QixPQUF3QixFQUN4QixHQUFvQyxFQUNwQyxLQUFtQyxFQUNyQyxFQUFFO0lBQ0EsSUFBSTtRQUNBLE1BQU0sUUFBUSxHQUFHLE1BQU0sT0FBTyxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUV6RCxPQUFPLFFBQVEsQ0FBQztLQUNuQjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1YsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNuQjtBQUNMLENBQUMsQ0FBQztBQXRERixpQkFBUyxLQUFLLFdBQ1YsT0FBd0IsRUFDeEIsSUFBUztJQUVULE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLE9BQXdCLEVBQUUsRUFBRTtRQUNoRCxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxLQUFLLEVBQy9CLEdBQW9DLEVBQ3BDLEtBQW1DLEVBQ3JDLEVBQUU7WUFDQSxNQUFNLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3pDLE9BQU87UUFDWCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssRUFDekIsR0FBb0MsRUFDcEMsS0FBbUMsRUFDckMsRUFBRSxDQUFDLE1BQU0sYUFBYSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUVuRCxDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssRUFDMUIsR0FBb0MsRUFDcEMsS0FBbUMsRUFDckMsRUFBRSxDQUFDLE1BQU0sZUFBZSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNyRCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnk6IE9sZWtzYW5kciBCZXpydWtvdlxuICogQ3JlYXRpb24gZGF0ZTogOSBNYXJjaCAyMDIwXG4gKlxuICogU3ViamVjdCBjb250cm9sbGVyIHdoaWNoIGhhbmRsZXMgYXBpIHJlcXVlc3RzLlxuICovXG5cbi8qKiBFeHRlcm5hbCBpbXBvcnRzICovXG5pbXBvcnQgeyBGYXN0aWZ5UmVwbHksIEZhc3RpZnlSZXF1ZXN0LCBGYXN0aWZ5SW5zdGFuY2UgfSBmcm9tICdmYXN0aWZ5JztcbmltcG9ydCB7IFNlcnZlclJlc3BvbnNlLCBJbmNvbWluZ01lc3NhZ2UgfSBmcm9tICdodHRwJztcblxuLyoqIEFwcGxpY2F0aW9uJ3MgaW1wb3J0cyAqL1xuXG5leHBvcnQgPSBhc3luYyBmdW5jdGlvbiAoXG4gICAgZmFzdGlmeTogRmFzdGlmeUluc3RhbmNlLFxuICAgIG9wdHM6IGFueSxcbikge1xuICAgIGZhc3RpZnkucmVnaXN0ZXIoYXN5bmMgKGZhc3RpZnk6IEZhc3RpZnlJbnN0YW5jZSkgPT4ge1xuICAgICAgICBmYXN0aWZ5LmFkZEhvb2soJ3ByZUhhbmRsZXInLCBhc3luYyAoXG4gICAgICAgICAgICByZXE6IEZhc3RpZnlSZXF1ZXN0PEluY29taW5nTWVzc2FnZT4sXG4gICAgICAgICAgICByZXBseTogRmFzdGlmeVJlcGx5PFNlcnZlclJlc3BvbnNlPixcbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCBmYXN0aWZ5LmF1dGhQcmVIYW5kbGVyKHJlcSwgcmVwbHkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9KTtcblxuICAgICAgICBmYXN0aWZ5LnBvc3QoJy9jcmVhdGUnLCBhc3luYyAoXG4gICAgICAgICAgICByZXE6IEZhc3RpZnlSZXF1ZXN0PEluY29taW5nTWVzc2FnZT4sXG4gICAgICAgICAgICByZXBseTogRmFzdGlmeVJlcGx5PFNlcnZlclJlc3BvbnNlPixcbiAgICAgICAgKSA9PiBhd2FpdCBjcmVhdGVIYW5kbGVyKGZhc3RpZnksIHJlcSwgcmVwbHkpKTtcblxuICAgIH0pO1xuICAgIGZhc3RpZnkuZ2V0KCcvc3ViamVjdHMnLCBhc3luYyAoXG4gICAgICAgIHJlcTogRmFzdGlmeVJlcXVlc3Q8SW5jb21pbmdNZXNzYWdlPixcbiAgICAgICAgcmVwbHk6IEZhc3RpZnlSZXBseTxTZXJ2ZXJSZXNwb25zZT4sXG4gICAgKSA9PiBhd2FpdCBzdWJqZWN0c0hhbmRsZXIoZmFzdGlmeSwgcmVxLCByZXBseSkpO1xufTtcblxuY29uc3QgY3JlYXRlSGFuZGxlciA9IGFzeW5jIChcbiAgICBmYXN0aWZ5OiBGYXN0aWZ5SW5zdGFuY2UsXG4gICAgcmVxOiBGYXN0aWZ5UmVxdWVzdDxJbmNvbWluZ01lc3NhZ2U+LFxuICAgIHJlcGx5OiBGYXN0aWZ5UmVwbHk8U2VydmVyUmVzcG9uc2U+LFxuKSA9PiB7XG4gICAgLyoqIEV4dHJhY3QgZGF0YSBmcm9tIHJlcXVlc3QgYm9keSAqL1xuICAgIGNvbnN0IG5hbWUgPSByZXEuYm9keS5uYW1lO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IGF3YWl0IGZhc3RpZnkuc3ViamVjdFNlcnZpY2UuY3JlYXRlKG5hbWUpO1xuXG4gICAgICAgIHJldHVybiBzdWJqZWN0O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXBseS5zZW5kKGVycik7XG4gICAgfVxufTtcblxuY29uc3Qgc3ViamVjdHNIYW5kbGVyID0gYXN5bmMgKFxuICAgIGZhc3RpZnk6IEZhc3RpZnlJbnN0YW5jZSxcbiAgICByZXE6IEZhc3RpZnlSZXF1ZXN0PEluY29taW5nTWVzc2FnZT4sXG4gICAgcmVwbHk6IEZhc3RpZnlSZXBseTxTZXJ2ZXJSZXNwb25zZT4sXG4pID0+IHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBzdWJqZWN0cyA9IGF3YWl0IGZhc3RpZnkuc3ViamVjdFNlcnZpY2Uuc3ViamVjdHMoKTtcblxuICAgICAgICByZXR1cm4gc3ViamVjdHM7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJlcGx5LnNlbmQoZXJyKTtcbiAgICB9XG59O1xuIl19