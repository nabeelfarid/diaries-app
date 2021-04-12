export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  token: string;
}

export interface Diary {
  id: number;
  title: string;
  subtitle: string;
  isPublic: boolean;
  userId: number;
  created: number;
  updated: number;
  entryIds: number[];
}

export interface Entry {
  id: number;
  title: string;
  content: string;
  diaryId: number;
  created: number;
  updated: number;
}

export enum ToastType {
  error = "error",
  warning = "warning",
  info = "info",
  success = "success",
}

export interface Toast {
  msg?: string;
  type?: ToastType;
  open: boolean;
}
