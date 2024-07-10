import React from 'react';
import UserList from '../components/UserList';

class HomePage extends React.Component{
    render() {
        return (
            <div data-testid="homepage">
                {/* <h1 className='text-center'>Homepage</h1> */}
                <UserList />
            </div>
        );
    }
}

export default HomePage;