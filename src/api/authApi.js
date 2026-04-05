import axios from "axios";

const API_URL = "https://api.ryban.ru/api";

export const registerUser = (role, data) => {
    return axios.post(`${API_URL}/users/signup/${role}`, data);
};