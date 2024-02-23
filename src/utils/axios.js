import axios from 'axios';
import { userInfo } from '../store';

const REACT_APP_BASE_URL_API = import.meta.env.PUBLIC_REACT_APP_BASE_URL_API;
const REACT_APP_BASE_URL_API_DASHBOARD = import.meta.env.PUBLIC_REACT_APP_BASE_URL_API_BAPENDA;

const REACT_APP_BASIC_AUTH_USERNAME = import.meta.env.PUBLIC_REACT_APP_BASIC_AUTH_USERNAME;
const REACT_APP_BASIC_AUTH_PASSWORD = import.meta.env.PUBLIC_REACT_APP_BASIC_AUTH_PASSWORD;

const BASE_URL = REACT_APP_BASE_URL_API;

export const fetchClient = (targetApi = 'api') => {
  const user = userInfo();

  const defaultOptions = {
    baseURL: BASE_URL,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (targetApi === 'api_dashboard') {
    defaultOptions.baseURL = REACT_APP_BASE_URL_API_DASHBOARD;
    defaultOptions.auth = {
      username: REACT_APP_BASIC_AUTH_USERNAME,
      password: REACT_APP_BASIC_AUTH_PASSWORD,
    }
  }

  // Create instance
  const instance = axios.create(defaultOptions);

  // Set the AUTH token for any request
  instance.interceptors.request.use(function (config) {
    if (targetApi !== 'api') {
      config.headers.Authorization = user ? `Bearer ${user.token}` : '';
    } else if (targetApi !== 'api_dashboard') {
      config.headers.Authorization = user ? `Bearer ${user.token}` : '';
    }
    return config;
  });

  return instance;
};
