import axios, { AxiosError } from "axios";
import store from "./store";
import { showToast } from "./diariesSlice";
import { Diary, Entry, ToastType, User } from "./models";

const ApiBaseUrl = "https://www.diaries-app.com/api";

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
  baseURL: ApiBaseUrl, //'https://some-domain.com/',
});

//response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    // Only return data
    console.log("axios instance response :", response.data);
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
        store.dispatch(
          showToast({
            type: ToastType.error,
            open: true,
            msg: response.data.message,
          })
        );
      }
    } else if (request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser
      console.log("Axios Error Request:", request);
      store.dispatch(
        showToast({
          type: ToastType.error,
          open: true,
          msg: "The request was made but no response was received",
        })
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Axios Error", error.message);
      store.dispatch(
        showToast({
          type: ToastType.error,
          open: true,
          msg:
            "Something happened in setting up the request that triggered an Error",
        })
      );
    }
    console.log("Axios Error Config:", error.config);

    return Promise.reject(error);
  }
);

const login = async (username: string, password: string): Promise<User> => {
  //   try {
  let response = await axiosInstance.post<AuthRequest, AuthResponse>(`/login`, {
    username,
    password,
  });
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
    `/signup`,
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

const getUserDiaries = async (userId: number): Promise<Diary[]> => {
  let { diaries } = await axiosInstance.get<null, { diaries: Diary[] }>(
    `/user/${userId}/diaries`
  );

  console.log("Diaries Api - getUserDiaries:", diaries);

  return diaries;
};

const getDiary = async (diaryId: number): Promise<Diary> => {
  let { diary } = await axiosInstance.get<null, { diary: Diary }>(
    `/diaries/${diaryId}`
  );

  console.log("Diaries Api - getDiary:", diary);

  return diary;
};

const createDiary = async (
  title: string,
  subtitle: string,
  isPublic: boolean,
  userId: number
): Promise<Diary> => {
  //   try {
  let { diary } = await axiosInstance.post<Partial<Diary>, { diary: Diary }>(
    `/diaries`,
    {
      title,
      subtitle,
      isPublic,
      userId,
    }
  );
  console.log("Diaries Api - Cratae Diary:", diary);

  return diary;
};

const editDiary = async (
  id: number,
  title: string,
  subtitle: string,
  isPublic: boolean,
  userId: number
): Promise<Diary> => {
  //   try {
  let { diary } = await axiosInstance.put<Partial<Diary>, { diary: Diary }>(
    `/diaries/${id}`,
    {
      id,
      title,
      subtitle,
      isPublic,
      userId,
    }
  );
  console.log("Diaries Api - Edit Diary:", diary);

  return diary;
};

const deleteDiary = async (id: number): Promise<Diary> => {
  let { diary } = await axiosInstance.delete<null, { diary: Diary }>(
    `/diaries/${id}`
  );
  console.log("Diaries Api - Delete Diary:", diary);

  return diary;
};

const getEntries = async (diaryId: number): Promise<Entry[]> => {
  let { entries } = await axiosInstance.get<null, { entries: Entry[] }>(
    `/diaries/${diaryId}/entries`
  );

  console.log("Diaries Api - getEntries:", entries);

  return entries;
};

const createEntry = async (
  title: string,
  content: string,
  diaryId: number
): Promise<Entry> => {
  let { entry } = await axiosInstance.post<Partial<Entry>, { entry: Entry }>(
    `/entries`,
    {
      title,
      content,
      diaryId,
    }
  );
  console.log("Diaries Api - Cratae Entry:", entry);

  return entry;
};

const editEntry = async (
  id: number,
  title: string,
  content: string
): Promise<Entry> => {
  let { entry } = await axiosInstance.put<Partial<Entry>, { entry: Entry }>(
    `/entries/${id}`,
    {
      id,
      title,
      content,
    }
  );
  console.log("Diaries Api - Edit Entry:", entry);

  return entry;
};

const deleteEntry = async (id: number): Promise<Entry> => {
  let { entry } = await axiosInstance.delete<null, { entry: Entry }>(
    `/entries/${id}`
  );
  console.log("Diaries Api - Delete Entry:", entry);

  return entry;
};

const DiariesApi = {
  login,
  signup,
  getUserDiaries,
  getDiary,
  createDiary,
  editDiary,
  deleteDiary,
  getEntries,
  createEntry,
  editEntry,
  deleteEntry,
};
export default DiariesApi;
