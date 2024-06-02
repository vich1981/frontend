import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authReducer';
import logger from 'redux-logger';

// const loggedInState = {
//   id: 1,
//   username: 'user1',
//   displayName: 'display1',
//   image: 'logo.png',
//   password: 'P4ssword',
//   isLoggedIn: true
// };

const configStore = (addLogger = true) => {
    return addLogger
    ? configureStore({
        reducer: authReducer,
        // preloadedState: loggedInState,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
    })
    : configureStore({
        reducer: authReducer,
        // preloadedState: loggedInState,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    });
};
export default configStore;