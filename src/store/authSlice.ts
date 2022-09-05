import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthUser = {
  name:string;
  email?:string;
} | Record<string, never>;

export interface AuthState {
  message:string;
  token: string;
  refreshToken: string;
  isLoggedIn: boolean;
  user: AuthUser;
  userId: string;
  authDate: string;
};

const retrieveUserFromLocalStorage = ():AuthUser => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    return JSON.parse(storedUser) as AuthUser;
  }
  return {};
};

const initialState: AuthState = {
  message: localStorage.getItem('message') || '',
  token: localStorage.getItem('token') || '',
  refreshToken: localStorage.getItem('refreshToken') || '',
  isLoggedIn: !!localStorage.getItem('token'),
  user: retrieveUserFromLocalStorage(),
  userId: localStorage.getItem('userId') || '',
  authDate: '',
};

export const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {

    create: (state, action:PayloadAction<AuthUser>) => {
      const user:AuthUser = { name:action.payload.name, email:action.payload.email };
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },

    login: (state, action: PayloadAction<AuthState>) => {
      const { message, token, refreshToken, userId, user:{ name }, authDate } = action.payload;
      state.message = message;
      state.token = token;
      state.refreshToken = refreshToken;
      state.userId = userId;
      state.isLoggedIn = true;
      state.user.name = name; // we have it from registration
      state.authDate = authDate;
      localStorage.setItem('message', message);
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', userId);
      localStorage.setItem('user', JSON.stringify(state.user));
      localStorage.setItem('authDate', authDate);
    },

    logout: state => {
      state.message = '';
      state.token = '';
      state.refreshToken = '';
      state.isLoggedIn = false;
      state.user = {};
      state.authDate = '';
      localStorage.removeItem('message');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      localStorage.removeItem('authDate');
    },

    refreshTokens: (state, action:PayloadAction<{newToken:string; refreshToken: string; newAuthDate:string}>) => {
      const { newToken, refreshToken, newAuthDate } = action.payload;
      state.token = newToken;
      state.refreshToken = refreshToken;
      state.authDate = newAuthDate;
      localStorage.setItem('token', newToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('authDate', newAuthDate);
    },
  },
});

export const authActions = authSlice.actions; // for subscriber (AuthForm, ...)

export default authSlice; // for store
