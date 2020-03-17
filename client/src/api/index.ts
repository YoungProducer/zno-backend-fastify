/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 26 February 2020
 *
 * Create Api class which have methods which make API calls to backend endpoints.
 */

// External imports
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Application's imports
import {
    IApi,
    ISignUpCredentials,
    ISignInCredentials,
    ISubjectConfigurationCredentials,
} from './types';

class Api implements IApi {
    axiosInstance: AxiosInstance;

    constructor() {
        const mode = process.env.NODE_ENV || 'production';

        const baseURL = mode === 'production'
            ? `${process.env.API_ENDPOINT}`
            : 'http://localhost:4000/api';

        this.axiosInstance = axios.create({
            baseURL,
            timeout: 10000,
        });
    }

    signup = async (credentials: ISignUpCredentials) =>
        await this.axiosInstance.post(
            'api/auth/user/signup',
            { ...credentials },
            { withCredentials: true },
        )

    signin = async (credentials: ISignInCredentials) =>
        await this.axiosInstance.post(
            'api/auth/user/signin',
            { ...credentials },
            { withCredentials: true },
        )

    me = async () =>
        await this.axiosInstance.get(
            'api/auth/user/me',
            { withCredentials: true },
        )

    logout = async () =>
        await this.axiosInstance.post(
            'api/auth/user/logout',
            {},
            { withCredentials: true },
        )

    subjects = async () =>
        await this.axiosInstance.get(
            'api/subject/subjects',
            { withCredentials: true },
        )

    /**
     * @value (String) subject name.
     */
    subjectConfiguration = async (credentials: ISubjectConfigurationCredentials) =>
        await this.axiosInstance.get(
            `api/subject-config/config/${credentials.id}`,
            { withCredentials: true },
        )
}

// Export all types related to Api
export * from './types';

// Export Api class
export default new Api();
