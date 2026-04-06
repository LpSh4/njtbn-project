import axios from "axios";

export const api = axios.create({
    baseURL: "https://api.ryban.ru/api",
    withCredentials: true,
});