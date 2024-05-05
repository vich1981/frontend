import React from 'react';
import Input from '../components/Input';

export class UserSignupPage extends React.Component {
    state = {
        displayName: '',
        userName: '',
        password: '',
        passwordRepeat: '',
        pendingApiCall: false,
        errors: {},
        passwordRepeatConfirmed: true
    };
    onChangeDisplayName = (event) => {
        const value = event.target.value;
        const errors = { ...this.state.errors }
        delete errors.displayName;
        this.setState({ displayName: value, errors });
    };
    onChangeUserName = (event) => {
        const value = event.target.value;
        const errors = { ...this.state.errors }
        delete errors.userName;
        this.setState({ userName: value, errors });
    };
    onChangePassword = (event) => {
        const value = event.target.value;
        const passwordConfirmed = this.state.passwordRepeat === value;
        const errors = { ...this.state.errors };
        delete errors.password;
        errors.passwordRepeat = passwordConfirmed ? '' : 'Does not match to password';
        this.setState({ password: value, passwordRepeatConfirmed: passwordConfirmed, errors});
    };
    onChangePasswordRepeat = (event) => {
        const value = event.target.value;
        const passwordRepeatConfirmed = this.state.password === value;
        const errors = { ...this.state.errors };
        errors.passwordRepeat = passwordRepeatConfirmed ? '' : 'Does not match to password';
        this.setState({ passwordRepeat: value, passwordRepeatConfirmed: passwordRepeatConfirmed, errors});
    };

    onClickSignup = () => {
        const user = {
            userName: this.state.userName,
            displayName: this.state.displayName,
            password: this.state.password
        };
        this.setState({pendingApiCall: true}); 
        this.props.actions.postSignup(user)
            .then((response) => {
                this.setState({ pendingApiCall: false });
            })
            .catch(apiError => {
                let errors = {...this.state.errors }
                if(apiError.response.data && apiError.response.data.validationErrors){
                    errors = {...apiError.response.data.validationErrors}
                }
                this.setState({ pendingApiCall: false, errors });
            });   
    };

    render() {
        return (
            <div className="container">
                <h1 className="text-center">Sign Up</h1>
                <div className="col-12 mb-3">
                    <Input
                        label="Display Name"
                        placeholder="Your display name" 
                        value={this.state.displayName}
                        onChange={this.onChangeDisplayName}
                        hasError={this.state.errors.displayName && true}
                        error={this.state.errors.displayName}
                    />
                </div>
                <div className="col-12 mb-3">
                    <Input
                        label="Your username"
                        placeholder="Your username" 
                        value={this.state.userName}
                        onChange={this.onChangeUserName}
                        hasError={this.state.errors.userName && true}
                        error={this.state.errors.userName}
                    />
                </div>
                <div className="col-12 mb-3">
                    <Input
                        label="Password"
                        placeholder="Your password" 
                        type="password"
                        value={this.state.password}
                        onChange={this.onChangePassword}
                        hasError={this.state.errors.password && true}
                        error={this.state.errors.password}
                    />
                </div>
                <div className="col-12 mb-3">
                    <Input
                        label="Password Repeat"
                        placeholder="Repeat your password" 
                        type="password"
                        value={this.state.passwordRepeat}
                        onChange={this.onChangePasswordRepeat}
                        hasError={this.state.errors.passwordRepeat && true}
                        error={this.state.errors.passwordRepeat}
                    />
                </div>
                <div className="text-center">
                    <button 
                        className="btn btn-primary" 
                        onClick={this.onClickSignup}
                        disabled={this.state.pendingApiCall || !this.state.passwordRepeatConfirmed}
                    >
                        {this.state.pendingApiCall && (
                        <div className="spinner-border text-light spinner-border-sm mr-1">
                            <span className="visually-hidden">Loading...</span>
                        </div>)}
                        Sign Up
                    </button>
                </div>



            </div>
        );
    }
}

UserSignupPage.defaultProps = {
    actions: {
        postSignup: () =>
            new Promise((resolve, reject) => {
                resolve({});
            })
    }
};

export default UserSignupPage;