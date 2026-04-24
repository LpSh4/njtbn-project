import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.PROD
        ? "https://api.ryban.ru/api"
        : "/api",
    withCredentials: true
});