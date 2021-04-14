import { createSlice } from '@reduxjs/toolkit';

type TColorScheme = 'light' | 'dark';

export enum ColorSchemes {
  light = 'light',
  dark = 'dark',
}

export type TAppReducer = {
  colorScheme: TColorScheme;
};

const initialState: TAppReducer = {
  colorScheme: ColorSchemes.light,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setColorScheme: (state, action: { type: string; payload: TColorScheme }) => {
      state.colorScheme = action.payload;
    },
  },
});

export default appSlice.reducer;
export const { setColorScheme } = appSlice.actions;
