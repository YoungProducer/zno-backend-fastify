/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 18 March 2020
 *
 * Declare main types and interfaces for test suite service and controller.
 */

export interface ICreateTestSuiteCredentials {
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
