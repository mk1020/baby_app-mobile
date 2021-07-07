import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {ColorSchemes, TAppReducer, TColorScheme, TSignIn, TSignInGoogle, TSignInRes, TToken} from './types';
import {RootStoreType} from './rootReducer';
import {req} from '../common/assistant/api';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const initialState: TAppReducer = {
  colorScheme: ColorSchemes.light,
  userToken: null,
  isLoading: true,
};

export const signIn = createAsyncThunk(
  'signIn/requestStatus',
  async (data: TSignIn, thunkAPI) => {
    try {
      const res =  await req(null).post<TSignInRes>('/signin', {email: data.login, password: data.password});
      return res.data?.token || null;
    } catch (err) {
      console.error(err.response?.data || err.response || err);
      return null;
    }
  },
);
export const oAuthGoogle = createAsyncThunk(
  'oAuthGoogle/requestStatus',
  async (data: TSignInGoogle, thunkAPI) => {
    try {
      const res = await req(null).post<TSignInRes>('/oauth/google', data);
      return res.data?.token || null;
    } catch (err) {
      console.error(err.response?.data || err.response || err);
      return null;
    }
  },
);

export const signOut = createAsyncThunk<boolean, undefined, {state: RootStoreType }>(
  'signOut/requestStatus', async (payload, thunkAPI) => {
    let res;
    try {
      res = <AxiosResponse<boolean>> await req(null).delete('/signOut', {headers: {token: thunkAPI.getState().app?.userToken?.token}});
      await GoogleSignin.signOut();
      //await GoogleSignin.revokeAccess();
    } catch (err) {
      console.error(err.response?.data || err.response || err);
      return false;
    } finally {
      return !!res?.data;
    }
  });

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setColorScheme: (state, action: PayloadAction<TColorScheme>) => {
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
    builder.addCase(oAuthGoogle.pending, (state: TAppReducer, action: PayloadAction) => {
      state.isLoading = true;
    });
    builder.addCase(oAuthGoogle.fulfilled, (state: TAppReducer, action: PayloadAction<TToken | null>) => {
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
