/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 18 March 2020
 *
 * Declare main types and interfaces for test suite service and controller.
 */

export type ImageType = 'TASK' | 'EXPLANATION';
export type AnswerType = 'SINGLE' | 'RELATIONS' | 'TEXT';

export interface Answer {
    answer: string[];
    type: AnswerType;
}

export interface ICreateTestSuiteHandlerCredentials {
    subjectName: string;
    subSubjectName?: string;
    /**
     * If this test suite related to exams sessions this field should have name of session.
     */
    session?: string;
    /**
     * If this test suite related to exams trainings this field should have name of training.
     */
    training?: string;
    /**
     * If this test suite related to themes this field should have name of theme.
     */
    theme?: string;
    /**
     * Array of answers.
     */
    // answers: Answer[];
    answers: string;
    /**
     * Array of images.
     */
    [attr: string]: any;
}

export interface ICreateTestSuiteCredentials {
    subjectName: string;
    subSubjectName?: string;
    /**
     * If this test suite related to exams sessions this field should have name of session.
     */
    session?: string;
    /**
     * If this test suite related to exams trainings this field should have name of training.
     */
    training?: string;
    /**
     * If this test suite related to themes this field should have name of theme.
     */
    theme?: string;
    /**
     * Array of answers.
     */
    answers: Answer[];
    // answers: string;
    /**
     * Array of tasks images.
     * Optional property.
     */
    tasksImages?: any[];
    /**
     * Array of explanations images.
     * Optional property.
     */
    explanationsImages?: any[];
}

export interface IGetTestSuiteCredentials {
    subjectId: string;
    subSubjectId?: string;
    /**
     * If this test suite related to exams sessions this field should have name of session.
     */
    session?: string;
    /**
     * If this test suite related to exams trainings this field should have name of training.
     */
    training?: string;
    /**
     * If this test suite related to themes this field should have name of theme.
     */
    theme?: string;
}

export interface IUploadImagesHandlerCredentials {
    /**
     * Id of test suite.
     */
    id: string;
    /**
     * Type of image: task or explanation.
     */
    type: ImageType;
    /**
     * Array of images
     */
    [attr: string]: string;
}

export interface IUploadImagesCredentials {
    /**
     * Id of test suite.
     */
    id: string;
    /**
     * Array of images
     */
    images: any[];
    /**
     * Type of image: task or explanation.
     */
    type: ImageType;
}

export interface IGetTestSuiteImagesCredentials {
    /**
     * Test suite id.
     */
    id: string;
    /**
     * Image type,
     * allows to select images for tasks or explanations.
     */
    type: ImageType;
}
