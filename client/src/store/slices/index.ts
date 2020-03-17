/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 26 February 2020
 *
 * Created root reducer for application.
 */

// External imports
import { combineReducers } from '@reduxjs/toolkit';

// Application's imports
import auth from './auth';
import subjects from './subjects';
import subjectConfiguration from './subjectConfiguration';

// Define root reducer
const rootReducer = combineReducers({
    auth,
    subjects,
    subjectConfiguration,
});

// Export actions
export * from './auth';
export * from './subjects';
export * from './subjectConfiguration';

// Export type of store
export type RootState = ReturnType<typeof rootReducer>;

// Export root reducer
export default rootReducer;
