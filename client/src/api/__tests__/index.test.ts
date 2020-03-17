/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 28 Feburary 2020
 *
 * Create test suites for api class.
 */

/** External imports */
import MockAdapter from 'axios-mock-adapter';

/** Application's imports */
import api from 'api';

describe('Api', () => {
    /** Create mock adapter for axios */
    const mockAxios = new MockAdapter(api.axiosInstance);

    afterEach(() => {
        /** Reset axios after each test to prevent unhandled errors */
        mockAxios.reset();
    });

    test('signup success', async () => {
        /** Mock '/auth/user/signup' url */
        mockAxios
            .onPost('/auth/user/signup')
            .reply(200);

        /** Get result of signup method */
        const result = await api.signup({
            email: 'foo',
            password: 'bar',
        });

        /** Assert that result has status 200 */
        expect(result.status).toBe(200);
    });

    test('signup success', async () => {
        /** Mock '/auth/user/signin' url */
        mockAxios
            .onPost('/auth/user/signin')
            .reply(200);

        /** Get result of signin method */
        const result = await api.signin({
            email: 'foo',
            password: 'bar',
        });

        /** Assert that result has status 200 */
        expect(result.status).toBe(200);
    });

    test('logout success', async () => {
        /** Mock '/auth/user/logout' url */
        mockAxios
            .onPost('/auth/user/logout')
            .reply(200);

        /** Get result of logout method */
        const result = await api.logout();

        /** Assert that result has status 200 */
        expect(result.status).toBe(200);
    });

    test('subjectsNames success', async () => {
        /** Mock '/subject/names url */
        mockAxios
            .onGet('/subject/subjects')
            .reply(200, ['foo']);

        /** Get result of subjectsNames method */
        const result = await api.subjects();

        /** Assert response has status 200 */
        expect(result.status).toBe(200);

        /** Assert response data equals ['foo'] */
        expect(result.data).toEqual(['foo']);
    });

    test('subjectConfiguration success', async () => {
        /** Define mocked response */
        const response = {
            subject: {
                name: 'Foo',
                theme: ['Theme 1', 'Theme 2'],
                exams: {
                    trainings: ['Variant 1', 'Variant 2'],
                    sessions: ['2017', '2018'],
                },
            },
        };

        /** Mock /subject-config/config/{subject-name} url */
        mockAxios
            .onGet('/subject-config/config/Foo')
            .reply(200, response);

        /** Get result of subjectConfiguration method */
        const result = await api.subjectConfiguration({ id: 'Foo' });

        /** Assert response has status 200 */
        expect(result.status).toBe(200);

        /** Assert response data equals mocked response */
        expect(result.data).toEqual(response);
    });
});
