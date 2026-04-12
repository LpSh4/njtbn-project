import axios from "axios";

export const api = axios.create({
    baseURL: "http://89.109.16.50:911/api",
    withCredentials: true
});