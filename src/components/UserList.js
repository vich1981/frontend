import React from "react";
import * as apiCalls from '../api/apiCalls';
import UserListItem from './UserListItem';
import Badge from "react-bootstrap/Badge";

class UserList extends React.Component {
    state = {
        page: {
            content:[],
            number: 0,
            size: 3
        }
    };

    componentDidMount() {
        this.loadData();
    };

    loadData = (requestPage = 0) => {
        apiCalls
            .listUsers({ page: requestPage, size: this.state.page.size })
            .then((response) => {
                this.setState({
                    page: response.data
                });
            });
    };

    onClickNext = () => {
        this.loadData(this.state.page.number + 1);
    };
    onClickPrevios = () => {
        this.loadData(this.state.page.number - 1);
    };

    render() {
        return (
            <div className="card">
                <h3 className="card-title m-auto">Users</h3>
                <div className="list-group list-group-flush" data-testid="usergroup">
                    {this.state.page.content.map((user) => {
                        return <UserListItem key={user.username} user={user}/>;
                    })}
                </div>
                <div>
                    {!this.state.page.first && (
                        <span className="float-start">
                            <Badge bg="light" text="dark" float="center"
                                onClick={this.onClickPrevios}
                                style={{cursor: 'pointer'}}
                            >
                                {'<'} Previos
                            </Badge>
                        </span>
                    )}
                    {!this.state.page.last && (
                        <span className="float-end">
                            <Badge bg="light" text="dark" float="center"
                                onClick={this.onClickNext}
                                style={{cursor: 'pointer'}}
                            >
                                Next {'>'}
                            </Badge>
                        </span>
                    )}
                </div>
            </div>
        );
    };
}

export default UserList; 