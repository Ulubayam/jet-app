import { configureStore } from '@reduxjs/toolkit';
import authReducer, { 
  loginWithGoogleRequest, 
  loginWithEmailRequest, 
  registerWithEmailRequest, 
  loginSuccess, 
  loginFailure, 
  logout 
} from './authSlice';
import type { AuthState, EmailPayload, User } from './types';

type RootState = {
  auth: AuthState;
};

describe('authSlice', () => {
  let store: ReturnType<typeof configureStore<RootState>>;
  
  const mockUser: User = {
    uid: '123',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://example.com/photo.jpg',
  };

  const mockEmailPayload: EmailPayload = {
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(() => {
    store = configureStore<RootState>({
      reducer: {
        auth: authReducer,
      },
    });
  });

  it('should handle initial state', () => {
    expect(store.getState().auth).toEqual({
      user: null,
      loading: false,
      error: null,
    });
  });

  describe('loginWithGoogleRequest', () => {
    it('should set loading to true and clear error', () => {
      store.dispatch(loginFailure('Previous error'));
      
      store.dispatch(loginWithGoogleRequest());
      
      expect(store.getState().auth).toMatchObject({
        loading: true,
        error: null,
      });
    });
  });

  describe('loginWithEmailRequest', () => {
    it('should set loading to true and clear error', () => {
      store.dispatch(loginFailure('Previous error'));
      
      store.dispatch(loginWithEmailRequest(mockEmailPayload));
      
      expect(store.getState().auth).toMatchObject({
        loading: true,
        error: null,
      });
    });
  });

  describe('registerWithEmailRequest', () => {
    it('should set loading to true and clear error', () => {
      store.dispatch(loginFailure('Previous error'));
      
      store.dispatch(registerWithEmailRequest(mockEmailPayload));
      
      expect(store.getState().auth).toMatchObject({
        loading: true,
        error: null,
      });
    });
  });

  describe('loginSuccess', () => {
    it('should set user and set loading to false', () => {
      store.dispatch(loginWithGoogleRequest());
      
      store.dispatch(loginSuccess(mockUser));
      
      expect(store.getState().auth).toMatchObject({
        user: mockUser,
        loading: false,
        error: null,
      });
    });
  });

  describe('loginFailure', () => {
    it('should set error and set loading to false', () => {
      const errorMessage = 'Authentication failed';
      
      store.dispatch(loginWithGoogleRequest());
      
      store.dispatch(loginFailure(errorMessage));
      
      expect(store.getState().auth).toMatchObject({
        user: null,
        loading: false,
        error: errorMessage,
      });
    });
  });

  describe('logout', () => {
    it('should clear user data', () => {
      store.dispatch(loginSuccess(mockUser));
      
      store.dispatch(logout());
      
      expect(store.getState().auth).toMatchObject({
        user: null,
        loading: false,
        error: null,
      });
    });
  });
});
