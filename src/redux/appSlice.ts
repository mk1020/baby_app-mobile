import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {httpBaseUrl} from '../common/consts';
import {ColorSchemes, TAppReducer, TColorScheme, TSignIn, TSignInRes} from './types';
import {RootStoreType} from './rootReducer';

const initialState: TAppReducer = {
  colorScheme: ColorSchemes.light,
  userToken: null,
  isLoading: true,
};

export const signIn = createAsyncThunk(
  'signIn/requestStatus',
  async (data: TSignIn, thunkAPI) => {
    const res = <AxiosResponse<TSignInRes>> await axios.post<TSignInRes>(httpBaseUrl + 'signin', {email: data.login, password: data.password})
      .catch(err => {
        console.log(err.response?.data);
      });
    return res?.data ? res.data.token : null;
  },
);

export const signOut = createAsyncThunk<boolean, undefined, {state: RootStoreType }>(
  'signOut/requestStatus', async (payload, thunkAPI) => {
    const res = <AxiosResponse<boolean>> await axios.delete(httpBaseUrl + 'signOut', {headers: {token: thunkAPI.getState().app.userToken}})
      .catch((err: AxiosError) => console.log(err.response));

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
    builder.addCase(signIn.fulfilled, (state: TAppReducer, action: PayloadAction<string | null>) => {
      state.userToken = action.payload;
    });
    builder.addCase(signOut.fulfilled, (state: TAppReducer, action: PayloadAction<boolean>) => {
      action.payload && (state.userToken = null);
    });
  },
});

export default appSlice.reducer;
export const {setColorScheme, setLoadingAppStatus} = appSlice.actions;
