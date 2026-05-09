import axios from "axios";

const isProd = import.meta.env.PROD;

export const api = axios.create({
    baseURL: isProd ? "https://api.ryban.ru/api" : "/api",
    withCredentials: true
});