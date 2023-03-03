import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  name: string | null;
  role: string | null;
  token: string | null;
}

const initialState: AuthState = {
  token: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateAuth: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
  },
});

export const { updateAuth } = authSlice.actions;

export default authSlice.reducer;