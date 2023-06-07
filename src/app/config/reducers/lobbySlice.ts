import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LobbyState {
  open: boolean;
}

const initialState: LobbyState = {
  open: false,
};

export const lobbySlice = createSlice({
  name: 'lobby',
  initialState,
  reducers: {
    setLobbyMode: (state, action: PayloadAction<true | false>) => {
      state.open = action.payload;
    },
  },
});

export const { setLobbyMode } = lobbySlice.actions;

export default lobbySlice.reducer;
