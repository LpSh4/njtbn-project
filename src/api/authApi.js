import { api } from "./axios";

export const registerUser = (role, data) => {
    return api.post(`/users/signup/${role}`, data);
};

export const loginUser = (data) => {
    return api.post(`/users/login`, data);
};

export const checkAuth = () => {
    return api.get(`/users/login`);
};

export const updateUser = (data) => {
    return api.patch(`/users/update`, data);
};