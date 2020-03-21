/** Declare interface for subject */
export interface ISubject {
    name: string;
    id: string;
    themes?: string[];
}

export type TSubjectConfig = ISubject & {
    /** Array which contains subsubjects */
    subSubjects?: ISubject[];
    exams?: {
        /** Training variants */
        trainings?: string[];
        /** Previous exams sessions */
        sessions?: string[];
    }
};
