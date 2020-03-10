/** */

/** Application's imports */
import { instance } from '../lib';
import { prisma } from '../prisma/generated/prisma-client';

describe('Auth controller', () => {
    test(`If remember flag is not provided cookies shouldn't have 'Max-Age' property`, async () => {
        /** Mock user method */
        prisma.user = jest.fn().mockResolvedValueOnce({
            id: '5e656cb724aa9a0007603f8e',
            email: 'bboy@gmail.com',
            password: '$2a$10$tgzWDUH7AWsHhAnthWcwzuDx8pY/Tl13U.wgF6uvCc2GiguX3uI06',
            role: 'DEFAULT_USER',
        });

        /** Make fake http request */
        const res = await instance.inject({
            method: 'POST',
            url: '/auth/user/signin',
            payload: {
                email: 'bboy@gmail.com',
                password: '12345678',
            },
        });

        /** Extract tokens from 'set-cookie' header */
        const accessToken = res.headers['set-cookie'][0];
        const refreshToken = res.headers['set-cookie'][0];

        /** Assert tokens don't have 'Max-Age' property */
        expect(accessToken.indexOf('Max-Age')).toBe(-1);
        expect(refreshToken.indexOf('Max-Age')).toBe(-1);
    });

    test(`If remember flag is not provided cookies should have 'Max-Age' property`, async () => {
        /** Mock user method */
        prisma.user = jest.fn().mockResolvedValueOnce({
            id: '5e656cb724aa9a0007603f8e',
            email: 'bboy@gmail.com',
            password: '$2a$10$tgzWDUH7AWsHhAnthWcwzuDx8pY/Tl13U.wgF6uvCc2GiguX3uI06',
            role: 'DEFAULT_USER',
        });

        /** Make fake http request */
        const res = await instance.inject({
            method: 'POST',
            url: '/auth/user/signin',
            payload: {
                email: 'bboy@gmail.com',
                password: '12345678',
                remember: true,
            },
        });

        /** Extract tokens from 'set-cookie' header */
        const accessToken = res.headers['set-cookie'][0];
        const refreshToken = res.headers['set-cookie'][0];

        /** Assert tokens have 'Max-Age' property */
        expect(accessToken.indexOf('Max-Age')).not.toBe(-1);
        expect(refreshToken.indexOf('Max-Age')).not.toBe(-1);
    });

    test('If credentials are invalid response should return 400', async () => {
        /** Mock user method to prevent call to db */
        prisma.user = jest.fn().mockResolvedValueOnce(undefined);

        /** Make fake http request */
        const res = await instance.inject({
            method: 'POST',
            url: '/auth/user/signin',
            payload: {
                email: 'bboy',
                password: '123',
                remember: true,
            },
        });

        expect(res.statusCode).toBe(400);
    });
});
