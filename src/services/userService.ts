import { SignupModel, LoginModel } from '../models/userModel';
import axios from 'axios';
import { http } from './api';

const BASE_URL = 'http://localhost:3000';

const loginUser = async (loginBody: LoginModel) => {
  return axios.post(`${BASE_URL}/user/login`, loginBody).then((res) => res.data);
};

const signupUser = async (signupBody: LoginModel) => {
  return axios.post(`${BASE_URL}/user/signup`, signupBody).then((res) => res.data);
};

const getMostActiveUser = () => {
  return http
    .get(`/user/most-active`)
    .then((res) => res.data)
}

export const userService = {
  loginUser,
  signupUser,
  getMostActiveUser,
}