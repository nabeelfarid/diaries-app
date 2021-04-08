export interface Diary {
  id: string;
  title: string;
  userId: string;
  random: string;
}

export interface User {
  username: string;
  password: string;
  email: string;
  token: string;
}
