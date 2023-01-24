// @ts-nocheck
import axios, { AxiosRequestConfig } from 'axios';

const BASE_URL = 'http://localhost:3000';

const getLocalStorageUser = () => {
  return localStorage.getItem('token')!
};


export const http = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const config = {
  apiUrl: BASE_URL,
}
http.interceptors.request.use(
  (config: AxiosRequestConfig<string>) => {
    const token = getLocalStorageUser();
    if (token) config.headers['Authorization'] = token
    return config;
  },
  (error) => Promise.reject(error)
);

