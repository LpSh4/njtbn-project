import { api } from "./axios";

export const registerUser = (role, data) => {
    return api.post(`/users/signup/${role}`, data);

};

export const loginUser = (data) => {
    return api.post(`/users/login`, data);

};

export const checkAuth = () => {
    const id = localStorage.getItem("userId");

    if (!id) {
        return Promise.reject("No user id");
    }

    return api.get(`/users/${id}`);
};

export const updateUser = (data) => {
    return api.patch(`/users/update`, data);
};

export const searchResumes = (params) => {
    return api.post("/resumes/search", params);
};

export const searchVacancies = (params) => {
    return api.post("/vacancies/search", params);
};