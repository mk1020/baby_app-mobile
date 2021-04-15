import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

type TColorScheme = 'light' | 'dark';

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

const signIn = createAsyncThunk(
  'signIn/requestStatus',
  async (userCredentials: TUserCredentials, thunkAPI) => {
    return 'mock-token-123';
  },
);

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setColorScheme: (state: TAppReducer, action: PayloadAction<TColorScheme>) => {
      state.colorScheme = action.payload;
    },
    restoreToken: (state: TAppReducer, action: PayloadAction<string>) => {
      state.userToken = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(signIn.fulfilled, (state: TAppReducer, action: PayloadAction<string>) => {});
  },
});

export default appSlice.reducer;
export const { setColorScheme, restoreToken } = appSlice.actions;
