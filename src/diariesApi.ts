import axios, { AxiosError, AxiosResponse } from "axios";
import { User } from "./models";

const ApiBaseUrl = "";
interface AuthResponse {
  token: string;
  username: string;
  password: string;
  email: string;
}

interface AuthRequest {
  username: string;
  password: string;
  email: string;
}

const axiosInstance = axios.create({
  baseURL: ApiBaseUrl, //'https://some-domain.com/api/',
});

//response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    // Only return data
    return response.data;
  },
  (error: AxiosError) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const request: XMLHttpRequest = error.request;
    const response = error.response;

    if (response) {
      console.log("Axios Error Response:", error.response);
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (response.status >= 400 && response.status < 500) {
        console.error("Axios Diaries API Error Msg:", response.data.message);
      }
    } else if (request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser
      console.log("Axios Error Request:", request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Axios Error", error.message);
    }
    console.log("Axios Error Config:", error.config);

    return Promise.reject(error);
  }
);

const login = async (username: string, password: string): Promise<User> => {
  //   try {
  let response = await axiosInstance.post<AuthRequest, AuthResponse>(
    `/api/login`,
    {
      username,
      password,
    }
  );
  console.log("Diaries Api - Login:", response);
  let user: User = response as User;

  return user;
};

const signup = async (
  username: string,
  password: string,
  email: string
): Promise<User> => {
  //   try {
  let response = await axiosInstance.post<AuthRequest, AuthResponse>(
    `/api/signup`,
    {
      username,
      password,
      email,
    }
  );
  console.log("Diaries Api - Signup:", response);
  let user: User = response as User;

  return user;
};

const DiariesApi = {
  login,
  signup,
};
export default DiariesApi;
