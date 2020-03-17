/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 26 February 2020
 *
 * Declare main interfaces related to API.
 */

// External imports
import { AxiosResponse, AxiosInstance } from 'axios';

export interface ISignUpCredentials {
    email: string;
    password: string;
}

export interface ISignInCredentials {
    email: string;
    password: string;
}

export interface ISubjectConfigurationCredentials {
    id: string;
}

export interface IApi {
    axiosInstance: AxiosInstance;
    signup(credentials: ISignUpCredentials): Promise<AxiosResponse>;
    signin(credentials: ISignInCredentials): Promise<AxiosResponse>;
    subjects(): Promise<AxiosResponse>;
    subjectConfiguration(credentials: ISubjectConfigurationCredentials): Promise<AxiosResponse>;
    me(): Promise<AxiosResponse>;
    logout(): Promise<AxiosResponse>;
}
