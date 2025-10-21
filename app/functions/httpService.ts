import axios from "axios";

export const httpService = axios.create({
    baseURL:"https://bkdco.com/fpm/api"
});

