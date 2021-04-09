export interface Diary {
  id: number;
  title: string;
  subtitle: string;
  public: boolean;
  userId: string;
  created: number;
  updated: number;
}

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  token: string;
}
