import { api } from "./axios";

export const registerUser = (role, data) => {
    return api.post(`/users/signup/${role}`, data);
};

export const loginUser = (data) => {
    return api.post(`/users/login`, data);
};

export const getMe = () => {
    return api.get(`/users/me`);
};

export const getUser = (me) => {
    return api.get(`/users/${me}`);
};