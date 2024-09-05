import React from "react";
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/authReducer';
import configStore from "../redux/configureStore";
import * as authActions from '../redux/authActions';
import HoaxSubmit from "./HoaxSubmit";
import * as apiCalls from '../api/apiCalls';
import { toBeInTheDocument } from "@testing-library/jest-dom/matchers";

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
                <HoaxSubmit />
            </MemoryRouter>
        </Provider>
        
    );
};

describe('HoaxSubmit', () => {
    describe('Layout', () => {
        it('has textarea', () => {
            const { container } = setup();
            const textArea = container.querySelector('textarea');
            expect(textArea).toBeInTheDocument();
        });
        it('has image', () => {
            const { container } = setup();
            const image = container.querySelector('img');
            expect(image).toBeInTheDocument();
        });
        it('displays textarea 1 line', () => {
            const { container } = setup();
            const textArea = container.querySelector('textarea');
            expect(textArea.rows).toBe(1);
        });
        it('displays user image', () => {
            const { container } = setup();
            const image = container.querySelector('img');
            expect(image.src).toContain('/images/profile/' + defaultState.image);
        });
    });
    describe('Interactions', () => {
        it('displays 3 rows when focused to textarea', () => {
            const { container } = setup();
            const textArea = container.querySelector('textarea');

            fireEvent.focus(textArea);

            expect(textArea.rows).toBe(3);
        });
        it('displays hoaxify button focused to textarea', () => {
            const { container, queryByText } = setup();
            const textArea = container.querySelector('textarea');
            fireEvent.focus(textArea);
            const hoaxifyButton = queryByText('Hoaxify');
            expect(hoaxifyButton).toBeInTheDocument();
        });
        it('displays cancel button focused to textarea', () => {
            const { container, queryByText } = setup();
            const textArea = container.querySelector('textarea');
            fireEvent.focus(textArea);
            const cancelButton = queryByText('Cancel');
            expect(cancelButton).toBeInTheDocument();
        });
        it('does not display Hoaxify button when not focused to textarea', () => {
            const { queryByText } = setup();
            const hoaxifyButton = queryByText('Hoaxify');
            expect(hoaxifyButton).not.toBeInTheDocument();
        });
        it('does not display Cancel button when not focused to textarea', () => {
            const { queryByText } = setup();
            const cancelButton = queryByText('Hoaxify');
            expect(cancelButton).not.toBeInTheDocument();
        });
        it('returns back to unfocused state after clicking the cancel', () => {
            const { container, queryByText } = setup();
            const textArea = container.querySelector('textarea');
            fireEvent.focus(textArea);
            const cancelButton = queryByText('Cancel');
            fireEvent.click(cancelButton);
            expect(queryByText('Cancel')).not.toBeInTheDocument();
        });
        it('calls postHoax with hoax request object when clicking Hoaxify', () => {
            const { container, queryByText } = setup();
            const textArea = container.querySelector('textarea');
            fireEvent.focus(textArea);
            fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

            const hoaxifyButton = queryByText('Hoaxify');

            apiCalls.postHoax = jest.fn().mockResolvedValue({});
            fireEvent.click(hoaxifyButton);

            expect(apiCalls.postHoax).toHaveBeenCalledWith({
                content: 'Test hoax content'
            });
        });
        it('returns back to unfocused state after successful postHoax action', async () => {
            const { container, queryByText } = setup();
            const textArea = container.querySelector('textarea');
            fireEvent.focus(textArea);
            fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

            const hoaxifyButton = queryByText('Hoaxify');

            apiCalls.postHoax = jest.fn().mockResolvedValue({});
            fireEvent.click(hoaxifyButton);

            await waitFor(() => expect(queryByText('Hoaxify')).not.toBeInTheDocument());
        });
        it('clear content after successful postHoax action', async () => {
            const { container, queryByText } = setup();
            const textArea = container.querySelector('textarea');
            fireEvent.focus(textArea);
            fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

            const hoaxifyButton = queryByText('Hoaxify');

            apiCalls.postHoax = jest.fn().mockResolvedValue({});
            fireEvent.click(hoaxifyButton);

            await waitFor(() => expect(queryByText('Test hoax content')).not.toBeInTheDocument());
        });
        it('clear content after clicking the cancel', () => {
            const { container, queryByText } = setup();
            const textArea = container.querySelector('textarea');
            fireEvent.focus(textArea);
            fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

            const cancelButton = queryByText('Cancel');
            fireEvent.click(cancelButton);

            expect(queryByText('Test hoax content')).not.toBeInTheDocument();
        });
        it('disables Hoaxify button when there is postHoax api call', async () => {
            const { container, queryByText } = setup();
            const textArea = container.querySelector('textarea');
            fireEvent.focus(textArea);
            fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

            const hoaxifyButton = queryByText('Hoaxify');

            const mockFunction = jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve({})
                    }, 300)
                });
            });
            apiCalls.postHoax = mockFunction;
            fireEvent.click(hoaxifyButton);
            fireEvent.click(hoaxifyButton);

            expect(mockFunction).toHaveBeenCalledTimes(1);
        });
        it('disables Cancel button when there is postHoax api call', async () => {
            const { container, queryByText } = setup();
            const textArea = container.querySelector('textarea');
            fireEvent.focus(textArea);
            fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

            const hoaxifyButton = queryByText('Hoaxify');

            const mockFunction = jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve({})
                    }, 300)
                });
            });
            apiCalls.postHoax = mockFunction;
            fireEvent.click(hoaxifyButton);
            
            const cancelButton = queryByText('Cancel');
            expect(cancelButton).toBeDisabled();
        });
        it('disables spinner when there is postHoax api call', async () => {
            const { container, queryByText } = setup();
            const textArea = container.querySelector('textarea');
            fireEvent.focus(textArea);
            fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

            const hoaxifyButton = queryByText('Hoaxify');

            const mockFunction = jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve({})
                    }, 300)
                });
            });
            apiCalls.postHoax = mockFunction;
            fireEvent.click(hoaxifyButton);
            
            
            expect(queryByText('Loading...')).toBeInTheDocument();
        });
        it('enables Hoaxify button when postHoax api call fails', async () => {
            const { container, queryByText } = setup();
            const textArea = container.querySelector('textarea');
            fireEvent.focus(textArea);
            fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

            const hoaxifyButton = queryByText('Hoaxify');

            const mockFunction = jest.fn().mockRejectedValueOnce({
                response: {
                    data: {
                        validationErrors: {
                            content: 'It must have minimum 10 and maximum 5000 characters'
                        }
                    }
                }
            });
            apiCalls.postHoax = mockFunction;
            fireEvent.click(hoaxifyButton);       
            await waitFor(() => expect(queryByText('Hoaxify')).not.toBeDisabled());
        });
        it('enables Cancel button when postHoax api call fails', async () => {
            const { container, queryByText } = setup();
            const textArea = container.querySelector('textarea');
            fireEvent.focus(textArea);
            fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

            const hoaxifyButton = queryByText('Hoaxify');

            const mockFunction = jest.fn().mockRejectedValueOnce({
                response: {
                    data: {
                        validationErrors: {
                            content: 'It must have minimum 10 and maximum 5000 characters'
                        }
                    }
                }
            });
            apiCalls.postHoax = mockFunction;
            fireEvent.click(hoaxifyButton);       
            await waitFor(() => expect(queryByText('Cancel')).not.toBeDisabled());
        });
        it('enables Hoaxify button after successful postHoax action', async () => {
            const { container, queryByText, findByText } = setup();
            const textArea = container.querySelector('textarea');
            fireEvent.focus(textArea);
            fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

            const hoaxifyButton = queryByText('Hoaxify');

            apiCalls.postHoax = jest.fn().mockResolvedValue({});
            fireEvent.click(hoaxifyButton);
            
            await waitFor(() =>{findByText('Hoaxify')});
            fireEvent.focus(textArea);
            await waitFor(() => expect(queryByText('Hoaxify')).not.toBeDisabled());
        });
    });
    it('display validation error for content', async () => {
        const { container, queryByText } = setup();
        const textArea = container.querySelector('textarea');
        fireEvent.focus(textArea);
        fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

        const hoaxifyButton = queryByText('Hoaxify');

        const mockFunction = jest.fn().mockRejectedValueOnce({
            response: {
                data: {
                    validationErrors: {
                        content: 'It must have minimum 10 and maximum 5000 characters'
                    }
                }
            }
        });
        apiCalls.postHoax = mockFunction;
        fireEvent.click(hoaxifyButton);       
        await waitFor(() => expect(queryByText('It must have minimum 10 and maximum 5000 characters')).toBeInTheDocument());
    });
    it('clear validation error after clicking cancel', async () => {
        const { container, queryByText, findByText } = setup();
        const textArea = container.querySelector('textarea');
        fireEvent.focus(textArea);
        fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

        const hoaxifyButton = queryByText('Hoaxify');

        const mockFunction = jest.fn().mockRejectedValueOnce({
            response: {
                data: {
                    validationErrors: {
                        content: 'It must have minimum 10 and maximum 5000 characters'
                    }
                }
            }
        });
        apiCalls.postHoax = mockFunction;
        fireEvent.click(hoaxifyButton);
        await waitFor(() => findByText('Cancel'));
        fireEvent.click(queryByText('Cancel'));
        expect(queryByText('It must have minimum 10 and maximum 5000 characters')).not.toBeInTheDocument();
    });
    it('clear validation error after content is changed', async () => {
        const { container, queryByText, findByText } = setup();
        const textArea = container.querySelector('textarea');
        fireEvent.focus(textArea);
        fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

        const hoaxifyButton = queryByText('Hoaxify');

        const mockFunction = jest.fn().mockRejectedValueOnce({
            response: {
                data: {
                    validationErrors: {
                        content: 'It must have minimum 10 and maximum 5000 characters'
                    }
                }
            }
        });
        apiCalls.postHoax = mockFunction;
        fireEvent.click(hoaxifyButton);

        await waitFor(() => findByText('Cancel'));

        fireEvent.change(textArea, { target: { value: 'Test hoax content updated'}});

        expect(queryByText('It must have minimum 10 and maximum 5000 characters')).not.toBeInTheDocument();
    });
});
console.error = () => {}; 