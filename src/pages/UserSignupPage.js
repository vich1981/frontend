import React from 'react';
import Input from '../components/Input';
import ButtonWithProgress from '../components/ButtonWithProgress';
import { withRouter } from '../components/withRouter';
import { connect } from 'react-redux';
import * as authActions from '../redux/authActions';

export class UserSignupPage extends React.Component {
    state = {
        displayName: '',
        username: '',
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
        delete errors.username;
        this.setState({ username: value, errors });
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
            username: this.state.username,
            displayName: this.state.displayName,
            password: this.state.password
        };
        this.setState({pendingApiCall: true}); 
        this.props.actions
            .postSignup(user)
            .then((response) => {
                this.setState({pendingApiCall: false}, () => {
                    this.props.navigate('/');
                 }); 
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
                        value={this.state.username}
                        onChange={this.onChangeUserName}
                        hasError={this.state.errors.username && true}
                        error={this.state.errors.username}
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
                    <ButtonWithProgress 
                        onClick={this.onClickSignup}
                        disabled={this.state.pendingApiCall || !this.state.passwordRepeatConfirmed}
                        pendingApiCall={this.state.pendingApiCall}
                        text="Sign Up"
                    />
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

const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            postSignup: (user) => dispatch(authActions.signupHandler(user))
        }
    };
};

export default connect(null, mapDispatchToProps)(withRouter(UserSignupPage));