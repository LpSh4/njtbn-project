import axios from "axios";

export const api = axios.create({
    baseURL: "https://ryban.ru/api",

    withCredentials: true
});