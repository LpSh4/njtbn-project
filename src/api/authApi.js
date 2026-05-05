import { api } from "./axios";

export const registerUser = (role, data) => {
    return api.post(`/users/signup/${role}`, data);

};

export const loginUser = (data) => {
    return api.post(`/users/login`, data);

};

export const checkAuth = () => {
    let id = localStorage.getItem("userId");

    if (!id) {
        const cachedUser = localStorage.getItem("user");
        if (cachedUser) {
            const parsed = JSON.parse(cachedUser);
            id = parsed.id || parsed._id;
        }
    }

    if (!id) {
        return Promise.reject("No user id found in storage");
    }

    return api.get(`/users/${id}`);
};

export const updateUser = (data) => {
    return api.patch(`/users/update`, data);
};

export const searchResumes = (params) => {
    return api.get("/resumes/search", { params });
};

export const searchVacancies = (params) => {
    return api.get("/vacancies/search", { params });
};

export const updateResume = (id, data) => {
    return api.patch(`/resumes/${id}`, data);
};

export const createVacancy = (data) => {
    return api.post("/vacancies/create", data);
};

export const updateVacancy = (id, data) => {
    return api.patch(`/vacancies/${id}`, data);
}
export const createResume = (data) => {
    return api.post("/resumes/create", data);
};