import axios from "axios";

export const httpService = axios.create({
    baseURL:"http://185.126.8.118/fpm/api"
});

