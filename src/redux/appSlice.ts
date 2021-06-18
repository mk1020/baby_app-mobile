import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {ColorSchemes, TAppReducer, TColorScheme, TSignIn, TSignInRes, TToken} from './types';
import {RootStoreType} from './rootReducer';
import {req} from '../common/assistant/api';

const initialState: TAppReducer = {
  colorScheme: ColorSchemes.light,
  userToken: null,
  isLoading: true,
};

export const signIn = createAsyncThunk(
  'signIn/requestStatus',
  async (data: TSignIn, thunkAPI) => {
    const res = <AxiosResponse<TSignInRes>> await req(null).post('/signin', {email: data.login, password: data.password})
      .catch((err: AxiosError) => {
        console.log(err.response?.data);
      });
    return res?.data ? res.data.token : null;
  },
);

export const signOut = createAsyncThunk<boolean, undefined, {state: RootStoreType }>(
  'signOut/requestStatus', async (payload, thunkAPI) => {
    const res = <AxiosResponse<boolean>> await req(null).delete('/signOut', {headers: {token: thunkAPI.getState().app?.userToken?.token}})
      .catch((err: AxiosError) => console.log(err.response));
    return res?.data;
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
    refreshToken: (state: TAppReducer, action: PayloadAction<TToken>) => {
      state.userToken = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(signIn.pending, (state: TAppReducer, action: PayloadAction) => {
      state.isLoading = true;
    });
    builder.addCase(signIn.fulfilled, (state: TAppReducer, action: PayloadAction<TToken | null>) => {
      state.userToken = action.payload;
      state.isLoading = false;
    });
    builder.addCase(signOut.fulfilled, (state: TAppReducer, action: PayloadAction<boolean>) => {
      action.payload && (state.userToken = null);
    });
  },
});

export default appSlice.reducer;
export const {setColorScheme, setLoadingAppStatus, refreshToken} = appSlice.actions;
