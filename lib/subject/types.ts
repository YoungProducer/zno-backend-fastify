/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * Declare main types and interfaces related to subject controller and service.
 */

/** Application's imports */
import { SubjectSchema } from '../models/subject';

export namespace SubjectTypes {
    export interface CreatePayload {
        name: string;
        isSubSubject: boolean;
    }
}

export interface ISubjectService {
    create: (payload: SubjectTypes.CreatePayload) => Promise<SubjectSchema>;
    subjects: (subSubject: boolean) => Promise<SubjectSchema[]>;
}
