import {combineReducers} from 'redux';
import appReducer from './appSlice';
import diaryReducer from './slices/diary';

export const rootReducer = combineReducers({
  app: appReducer,
  diary: diaryReducer
});

export type RootStoreType = ReturnType<typeof rootReducer>;
