export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface EmailPayload {
  email: string;
  password: string;
}

export interface LoginSuccessPayload {
  user: User;
}

export interface LoginFailurePayload {
  error: string;
}
