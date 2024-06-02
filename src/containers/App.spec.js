import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/authReducer';
import axios from 'axios';
import configStore from '../redux/configureStore';

const setup = (path) => {
    const store = configStore(false);
    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={[path]}>
                <App />
            </MemoryRouter>
        </Provider>
            
    );
};

describe('App', () => {
    const changeEvent = (content) => {
        return {
            target: {
                value: content
            }
        };
    };
    it('displays homepage when url is /', () => {
        const { queryByTestId } = setup('/');
        expect(queryByTestId('homepage')).toBeInTheDocument();
    });

    it('displays LoginPage when url is /login', () =>{
        const { container } = setup('/login');
        const header = container.querySelector('h1');
        expect(header).toHaveTextContent('Login');
    });

    it('displays only LoginPage when url is /login', () =>{
        const { queryByTestId } = setup('/login');
        expect(queryByTestId('homepage')).not.toBeInTheDocument();
    });

    it('displays UserSignupPage when url is /signup', () =>{
        const { container } = setup('/signup');
        const header = container.querySelector('h1');
        expect(header).toHaveTextContent('Sign Up');
    });

    it('displays UserPage when url is other than /, /login or /signup', () =>{
        const { queryByTestId } = setup('/user1');
        expect(queryByTestId('userpage')).toBeInTheDocument();
    });

    it('display topBar when url is /', () => {
        const { container } = setup('/');
        const navigation = container.querySelector('nav');
        expect(navigation).toBeInTheDocument();
    });

    it('display topBar when url is /login', () => {
        const { container } = setup('/login');
        const navigation = container.querySelector('nav');
        expect(navigation).toBeInTheDocument();
    });

    it('display topBar when url is /signup', () => {
        const { container } = setup('/signup');
        const navigation = container.querySelector('nav');
        expect(navigation).toBeInTheDocument();
    });

    it('display topBar when url is /user1', () => {
        const { container } = setup('/user1');
        const navigation = container.querySelector('nav');
        expect(navigation).toBeInTheDocument();
    });

    it('shows the UserSignupPage when clicking signup', () => {
        const { queryByText, container } = setup('/');
        const signupLink = queryByText('Sign Up');
        fireEvent.click(signupLink);
        const header = container.querySelector('h1');
        expect(header).toHaveTextContent('Sign Up');
    });

    it('shows the LoginPage when clicking login', () => {
        const { queryByText, container } = setup('/');
        const loginLink = queryByText('Login');
        fireEvent.click(loginLink);
        const header = container.querySelector('h1');
        expect(header).toHaveTextContent('Login');
    });

    it('shows the HomePage when clicking the logo', () => {
        const { queryByTestId, container } = setup('/login');
        const logo = container.querySelector('img');
        fireEvent.click(logo);
        expect(queryByTestId('homepage')).toBeInTheDocument();
    });
    it('displays My Profile on TopBar after login success', async () => {
        const { queryByPlaceholderText, container, findByText } = setup('/login');
        
        const usernameInput = queryByPlaceholderText('Your username');
        fireEvent.change(usernameInput, changeEvent('user1'));
        const passwordInput = queryByPlaceholderText('Your password');
        fireEvent.change(passwordInput, changeEvent('P4ssword'));
        const button = container.querySelector('button');
        axios.post = jest.fn().mockResolvedValue({
            data: {
                id: 1,
                username: 'user1',
                displayName: 'display1',
                image: 'profile1.png'
            }
        });
        fireEvent.click(button);
        const myProfileLink = await findByText('My Profile');
        expect(myProfileLink).toBeInTheDocument();

    });
    it('displays My Profile on TopBar after signup success', async () => {
        const { queryByPlaceholderText, container, findByText } = setup('/signup');
        const displayNameInput = queryByPlaceholderText('Your display name');
        const userNameInput = queryByPlaceholderText('Your username');
        const passwordInput = queryByPlaceholderText('Your password');
        const passwordRepeat = queryByPlaceholderText('Repeat your password');

        fireEvent.change(displayNameInput, changeEvent('display1'));
        fireEvent.change(userNameInput, changeEvent('user1'));
        fireEvent.change(passwordInput, changeEvent('P4ssword'));
        fireEvent.change(passwordRepeat, changeEvent('P4ssword'));

        const button = container.querySelector('button');
        axios.post = jest.fn().mockResolvedValueOnce({
            data: {
                message: 'User saved'
            }
        })
        .mockResolvedValueOnce({
            data: {
                id: 1,
                username: 'user1',
                displayName: 'display1',
                image: 'profile1.png'
            }
        });
        fireEvent.click(button);
        const myProfileLink = await findByText('My Profile');
        expect(myProfileLink).toBeInTheDocument();

    });
});

