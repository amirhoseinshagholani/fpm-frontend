import axios from "axios";

export const httpService = axios.create({
    baseURL:"http://localhost:5000/fpm/api"
});