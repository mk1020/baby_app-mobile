import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {httpBaseUrl} from '../common/consts';

export type TColorScheme = 'light' | 'dark';

export type TAppReducer = {
  colorScheme: TColorScheme;
  userToken: string | null;
  isLoading: boolean;
};

type TSignIp = {
  login: string;
  password: string;
};
type TSignUp = {
  login: string;
  password: string;
  confirmPass: string;
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
  async (date: TSignIp, thunkAPI) => {

    await axios.post(httpBaseUrl + 'signin', date);
    return 'mock-token-123';
  },
);
const signUp = createAsyncThunk(
  'signIn/requestStatus',
  async (data: TSignUp, thunkAPI) => {

    const res = await axios.post(httpBaseUrl + 'signup', data);
    return !!res;
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
export const {setColorScheme, setLoadingAppStatus} = appSlice.actions;
