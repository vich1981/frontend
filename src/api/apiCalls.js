import axios from 'axios';
import { encodeBase64 } from '../redux/encoderFunctions';

export const signup = (user) => {
    return axios.post('/api/1.0/users', user);
};

export const login = (user) => {
    return axios.post('/api/1.0/login', {}, { auth: user });
};

export const setAuthorizationHeader = ({username, password, isLoggedIn }) => {
    if (isLoggedIn){
        axios.defaults.headers.common['Authorization'] = `Basic ${encodeBase64( 
            username + ':' + password
        )}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
    
};

export const listUsers = (param = { page: 0, size: 3 }) => {
    const path = `/api/1.0/users?page=${param.page || 0}&size=${param.size || 3}`;
    return axios.get(path);
};

export const getUser = (username) => {
    return axios.get(`/api/1.0/users/${username}`);
};

export const updateUser = (userId, body) => {
    return axios.put('/api/1.0/users/' + userId, body);
};

export const postHoax = (hoax) => {
    return axios.post('/api/1.0/hoaxes', hoax);
};

export const loadHoaxes = (username) => {
    const basePath = username ? `/api/1.0/users/${username}/hoaxes`: '/api/1.0/hoaxes';
    return axios.get(basePath + '?page=0&size=5&sort=id,desc');
};