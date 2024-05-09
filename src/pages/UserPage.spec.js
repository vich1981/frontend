import React from 'react';
import { 
    render,
    cleanup,
    fireEvent,
    waitFor
} from '@testing-library/react';
import UserPage from './UserPage';

describe('UserPage', () => {
    describe('Layout', () => {
        it('has user page div', () => {
            const { queryByTestId } = render(<UserPage />);
            const userPageDiv = queryByTestId('userpage');
            expect(userPageDiv).toBeInTheDocument();
        });
    });
});