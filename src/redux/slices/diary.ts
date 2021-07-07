import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TReducer} from './types';

const initialState: TReducer = {
  currentDiaryId: 'j22r7vz58cf41q4i',
};

const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    setCurrentDiary: (state, action: PayloadAction<string>) => {
      state.currentDiaryId = action.payload;
    },
  },
  extraReducers: builder => {
  },
});

export default diarySlice.reducer;
export const {setCurrentDiary} = diarySlice.actions;
