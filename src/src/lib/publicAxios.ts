import axios, { AxiosResponse, AxiosError } from "axios";

const publicAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BACKEND_URL,
  withCredentials: true,
});

publicAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    // response.data = { metadata, data } từ backend
    return response.data;
  },
  (error: AxiosError) => {
    return Promise.reject(error?.response?.data || error);
  }
);

export default publicAxios;
