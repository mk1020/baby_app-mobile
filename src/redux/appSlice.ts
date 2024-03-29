import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {ColorSchemes, TAppReducer, TColorScheme, TSignIn, TSignInGoogle, TSignInRes, TToken} from './types';
import {RootStoreType} from './rootReducer';
import {req} from '../common/assistant/api';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {TLanguage} from '../common/localization/localization';
import {Alert} from 'react-native';
import {commonAlert} from '../common/components/CommonAlert';

const initialState: TAppReducer = {
  colorScheme: ColorSchemes.light,
  userToken: null,
  googleAccessToken: null,
  userId: null,
  diaryId: null,
  isLoading: false,
  language: null,
  diaryTitle: '',
  forceUpdate: 0,
  deletedPhotos: [],
  lastSyncAt: 0,
  userEmail: '',
  lastUserEmail: '',
  isAuthError: false,
  notificationAfterChangeAccWasShown: false
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

      return res.data;
    } catch (err) {
      console.log(err.response?.data);
      console.error(err.response || err.response || err);
      return null;
    }
  },
);

export const signOut = createAsyncThunk<boolean, undefined, {state: RootStoreType }>(
  'signOut/requestStatus', async (payload, thunkAPI) => {
    let res;
    try {
      await GoogleSignin.signOut();
      res = <AxiosResponse<boolean>> await req(null).delete('/signOut', {headers: {token: thunkAPI.getState().app?.userToken?.token}});
      //await GoogleSignin.revokeAccess().catch(console.warn);
      return !!res?.data;
    } catch (err) {
      console.error(err.message);
      if (err.message === 'Network Error') {
        return true;
      } else {
        return false;
      }
    }
  });

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setColorScheme: (state, action: PayloadAction<TColorScheme>) => {
      state.colorScheme = action.payload;
    },
    addDeletedPhotos: (state, action: PayloadAction<string[]>) => {
      state.deletedPhotos = [...state.deletedPhotos, ...action.payload];
    },
    setGoogleAccessToken: (state, action: PayloadAction<string>) => {
      state.googleAccessToken = action.payload;
    },
    setDiaryId: (state, action: PayloadAction<string>) => {
      state.diaryId = action.payload;
    },
    setLoadingAppStatus: (state: TAppReducer, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    refreshToken: (state: TAppReducer, action: PayloadAction<TToken>) => {
      state.userToken = action.payload;
    },
    changeLanguage: (state: TAppReducer, action: PayloadAction<TLanguage>) => {
      state.language = action.payload;
    },
    changeDiaryTitle: (state: TAppReducer, action: PayloadAction<string>) => {
      state.diaryTitle = action.payload;
    },
    setLastSyncAt: (state: TAppReducer, action: PayloadAction<number>) => {
      state.lastSyncAt = action.payload;
    },
    setLastUserEmail: (state: TAppReducer, action: PayloadAction<string>) => {
      state.lastUserEmail = action.payload;
    },
    setNotificationAfterChangeAcc: (state: TAppReducer, action: PayloadAction<boolean>) => {
      state.notificationAfterChangeAccWasShown = action.payload;
    },
    forceUpdate: (state: TAppReducer) => {
      state.forceUpdate += 1;
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
    builder.addCase(oAuthGoogle.fulfilled, (state: TAppReducer, action: PayloadAction<TSignInRes | null>) => {
      state.userToken = action.payload?.token || null;
      state.isLoading = false;
      state.isAuthError = !action.payload;
      state.userId = action.payload?.userId || null;
      if (action.payload?.email !== state.lastUserEmail) {
        state.deletedPhotos = [];
        state.lastSyncAt = 0;
      }
      state.userEmail = action.payload?.email || '';
    });
    builder.addCase(signOut.fulfilled, (state: TAppReducer, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.userToken = null;
        state.lastUserEmail = state.userEmail;
        state.userId = null;
        state.userEmail = '';
        state.notificationAfterChangeAccWasShown = false;
      }
    });
  },
});

export default appSlice.reducer;
export const {
  setColorScheme,
  setLoadingAppStatus,
  refreshToken,
  changeLanguage,
  changeDiaryTitle,
  forceUpdate,
  setGoogleAccessToken,
  setDiaryId,
  addDeletedPhotos,
  setLastSyncAt,
  setLastUserEmail,
  setNotificationAfterChangeAcc
} = appSlice.actions;
