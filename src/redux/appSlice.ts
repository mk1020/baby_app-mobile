import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from "axios";
import { httpBaseUrl } from "../common/assistant/others";

export type TColorScheme = 'light' | 'dark';

export type TAppReducer = {
  colorScheme: TColorScheme;
  userToken: string | null;
  isLoading: boolean;
};

type TUserCredentials = {
  login: string;
  password: string;
};

export enum ColorSchemes {
  light = 'light',
  dark = 'dark',
}

const initialState: TAppReducer = {
  colorScheme: ColorSchemes.light,
  userToken: null,
  isLoading: true,
};

export const signIn = createAsyncThunk(
  'signIn/requestStatus',
  async (userCredentials: TUserCredentials, thunkAPI) => {

    await axios.post(httpBaseUrl + 'signin', userCredentials)
    return 'mock-token-123';
  },
);

export const signOut = createAsyncThunk('signOut/requestStatus', async (payload, thunkAPI) => {
  return true;
});

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setColorScheme: (state: TAppReducer, action: PayloadAction<TColorScheme>) => {
      state.colorScheme = action.payload;
    },
    setLoadingAppStatus: (state: TAppReducer, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(signIn.fulfilled, (state: TAppReducer, action: PayloadAction<string>) => {
      state.userToken = action.payload;
    });
    builder.addCase(signOut.fulfilled, (state: TAppReducer, action) => {
      state.userToken = null;
    });
  },
});

export default appSlice.reducer;
export const { setColorScheme, setLoadingAppStatus } = appSlice.actions;
