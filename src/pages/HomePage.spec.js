import React from 'react';
import { 
    render,
    cleanup,
    fireEvent,
    waitFor
} from '@testing-library/react';
import HomePage from './HomePage';
import * as apiCalls from '../api/apiCalls';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/authReducer';
import configStore from "../redux/configureStore";
import * as authActions from '../redux/authActions';

const defaultState = {
    id: 1,
    username: 'user1',
    displayName: 'display1',
    image: 'profile.png',
    password: 'P4ssword',
    isLoggedIn: true
};

let store;

const setup = (state = defaultState) => {
    store = configureStore({
        reducer: authReducer,
        preloadedState: state,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    });
    return render(
        <Provider store={store}>
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        </Provider>
        
    );
};

apiCalls.listUsers = jest.fn().mockResolvedValue({
    data:{
        content: [],
        number: 0,
        size: 3
    }
});

describe('HomePage', () => {
    describe('Layout', () => {
        it('has root page div', () => {
            const { queryByTestId } = setup();
            const homePageDiv = queryByTestId('homepage');
            expect(homePageDiv).toBeInTheDocument();
        });
        it('displays hoax submit when user logged in', () => {
            const { container } = setup();
            const textArea = container.querySelector('textarea');
            expect(textArea).toBeInTheDocument();
        });
        it('does not displays hoax submit when user not logged in', () => {
            const notLoggedInState = {
                id: 0,
                username: '',
                displayName: '',
                password: '',
                image: '',
                isLoggedIn: false
            };
            const { container } = setup(notLoggedInState);
            const textArea = container.querySelector('textarea');
            expect(textArea).not.toBeInTheDocument();
        });
    });
});
console.error = () => {};