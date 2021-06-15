import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios, {AxiosResponse} from 'axios';
import {httpBaseUrl} from '../common/consts';
import {ColorSchemes, TAppReducer, TColorScheme, TSignIn} from './types';

const initialState: TAppReducer = {
  colorScheme: ColorSchemes.light,
  userToken: null,
  isLoading: true,
};
export type TSignInRes = {
  userId: number,
  token: string
}
export const signIn = createAsyncThunk(
  'signIn/requestStatus',
  async (date: TSignIn, thunkAPI) => {
    const res = <AxiosResponse<TSignInRes>> await axios.post<TSignInRes>(httpBaseUrl + 'signin', {email: date.login, password: date.password})
      .catch(err => {
        console.log(err.response?.data);
      });
    console.log(res?.data);
    return res?.data ? res.data.token : null;
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
    builder.addCase(signIn.fulfilled, (state: TAppReducer, action: PayloadAction<string | null>) => {
      state.userToken = action.payload;
    });
    builder.addCase(signOut.fulfilled, (state: TAppReducer, action) => {
      state.userToken = null;
    });
  },
});

export default appSlice.reducer;
export const {setColorScheme, setLoadingAppStatus} = appSlice.actions;
