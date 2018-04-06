import { AppRegistry } from 'react-native';
import { Client } from 'bugsnag-react-native';
const bugsnag = new Client();
import App from './App';
AppRegistry.registerComponent('uestc_react_native_ios', () => App);
