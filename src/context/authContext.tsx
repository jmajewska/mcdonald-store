import React, { useReducer, Reducer } from 'react';
import { AuthStates, AuthAction, AuthState } from '../models/authModel';

interface Props {
  children?: React.ReactNode,
};

type Context = {
  state: AuthState,
  dispatch: React.Dispatch<AuthAction>
  ,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthStates.LOGIN:
      return {
        isLoggedIn: true,
        user: action.payload.user,
        isAdmin: action.payload.isAdmin
      };
    case AuthStates.LOGOUT:
      return {
        isLoggedIn: false,
        user: "",
        isAdmin: false,
      };
    default:
      return state;
  }
};
const initialAuthContext = {
  isLoggedIn: false,
  user: "",
  dispatch: ''
};

const authInitialState = {
  isLoggedIn: false,
  user: "",
  isAdmin: false,
};

export const AuthContext = React.createContext<Context>({ state: authInitialState, dispatch: () => null } as Context);

export const AuthContextProvider: React.FC<Props> = ({ children }) => {
  if (localStorage.getItem('user')){
    authInitialState.isLoggedIn = true
    authInitialState.user = localStorage.getItem('user')!
  }
  
  if(localStorage.getItem('isAdmin')){
    const isAdmin = localStorage.getItem('isAdmin')
    if(isAdmin !== 'undefined'){
      const isAdmin = JSON.parse(localStorage.getItem('isAdmin')!)
      authInitialState.isAdmin = isAdmin;
    } else {
      authInitialState.isAdmin = false;
    }
  }
  
  const [state, dispatch] = useReducer(authReducer, authInitialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
