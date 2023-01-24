export enum AuthStates {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export interface AuthAction {
  type: AuthStates;
  payload: {
    user: string,
    isAdmin: boolean,
  };
}

export interface AuthState {
  isLoggedIn: boolean;
  user: string;
  isAdmin: boolean,
}

interface AuthContextModel {
  isLoggedIn: boolean;
  user: string;
}

export interface ErrorsModel {
  username?: string;
  email?: string;
  password?: string;
}
