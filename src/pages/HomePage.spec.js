import React from 'react';
import { 
    render,
    cleanup,
    fireEvent,
    waitFor
} from '@testing-library/react';
import HomePage from './HomePage';

describe('HomePage', () => {
    describe('Layout', () => {
        it('has root page div', () => {
            const { queryByTestId } = render(<HomePage />);
            const homePageDiv = queryByTestId('homepage');
            expect(homePageDiv).toBeInTheDocument();
        });
    });
});