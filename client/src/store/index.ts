/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 26 February 2020
 *
 * Configure store and apply middlewares.
 */

// External impors
import {
    configureStore,
    getDefaultMiddleware,
} from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';

// Application's imports
import rootReducer from './slices';
import testState from './testState';

const createStore = () => {
    /** Extract env variable */
    const useTestState: string = process.env.REACT_USE_TEST_STATE || 'false';

    /** Define middlewares */
    const midlleware = getDefaultMiddleware({
        thunk: true,
        serializableCheck: true,
        immutableCheck: true,
    });

    /** Setup logger middleware */
    const logger = createLogger({
        collapsed: true,
        diff: true,
    });

    /**
     * Init preloaded state.
     * If useTestState equals true load testState
     * in other case set preloadedState as undefined.
     */
    const preloadedState = useTestState === 'true' ? testState : undefined;

    return configureStore({
        preloadedState,
        reducer: rootReducer,
        middleware: [...midlleware, logger],
    });
};

/** Create store */
const store = createStore();

export type AppDispatch = typeof store.dispatch;

export default store;
