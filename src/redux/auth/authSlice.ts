import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User, EmailPayload } from "./types";

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginWithGoogleRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loginWithEmailRequest: (state, _action: PayloadAction<EmailPayload>) => {
      state.loading = true;
      state.error = null;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    registerWithEmailRequest: (state, _action: PayloadAction<EmailPayload>) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
    },

    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    logout: (state) => {
      state.user = null;
    },
  },
});

export const {
  loginWithGoogleRequest,
  loginWithEmailRequest,
  registerWithEmailRequest,
  loginSuccess,
  loginFailure,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
