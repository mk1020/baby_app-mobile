import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import {AppContainer} from './src/AppContainer';
import {name as appName} from './app.json';

// eslint-disable-next-line @typescript-eslint/no-var-requires
global.PaymentRequest = require('react-native-payments').PaymentRequest;
AppRegistry.registerComponent(appName, () => AppContainer);
