import React, {memo} from 'react';
import {Platform, UIManager} from 'react-native';
import {Provider} from 'react-redux';
import './common/localization/localization';
import {App} from './App';
import {ErrorBoundary} from './common/components/ErrorBoundary';
import {store} from './redux/store';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {babyAppSchema} from './model/schema';
import {Diary, Note} from './model/Diary';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import {migrations} from './model/migrations';

const adapter = new SQLiteAdapter({
  schema: babyAppSchema,
  migrations,
  dbName: 'baby_app',
  // jsi: true, /* Platform.OS === 'ios' */
  // onSetUpError: error => {
  // Database failed to load -- offer the user to reload the app or log out
  // }
});

export const database = new Database({
  adapter,
  modelClasses: [Diary, Note],
  actionsEnabled: true,
});

(function setup() {
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
})();

export const AppContainer = memo(() => {

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate persistor={persistStore(store)}>
          <DatabaseProvider database={database}>
            <App />
          </DatabaseProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
});
