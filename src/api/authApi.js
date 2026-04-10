import { api } from "./axios";

export const registerUser = (role, data) => {
    return api.post(`/users/signup/${role}`, data);

};

export const loginUser = (data) => {
    return api.post(`/users/login`, data);

};

export const checkAuth = () => {
    // Try to get explicit userId, or pull it from the cached user object
    let id = localStorage.getItem("userId");

    if (!id) {
        const cachedUser = localStorage.getItem("user");
        if (cachedUser) {
            const parsed = JSON.parse(cachedUser);
            id = parsed.id || parsed._id; // Use whichever ID field your backend uses
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
    return api.post("/resumes/search", params);
};

export const searchVacancies = (params) => {
    return api.post("/vacancies/search", params);
};