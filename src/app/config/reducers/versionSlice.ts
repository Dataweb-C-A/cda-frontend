import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LobbyState {
  version: string | null;
}

const initialState: LobbyState = {
  version: null,
};

export const versionSlice = createSlice({
  name: 'version',
  initialState,
  reducers: {
    getVersion: (state) => {
      const version = localStorage.getItem('version')
      if (version) {
        state.version = JSON.parse(version)
      }
    },
    setVersion: (state, action: PayloadAction<string>) => {
      state.version = action.payload
      localStorage.setItem('version', JSON.stringify(action.payload))
    }
  },
});

export const { getVersion } = versionSlice.actions;

export default versionSlice.reducer;
