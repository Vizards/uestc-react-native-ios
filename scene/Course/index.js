import React from 'react';
import { StackNavigator } from 'react-navigation';
import Calendar from "./containers/Calendar";
import Main from './containers/Main';

export default StackNavigator(
  {
    Main: {
      screen: Main,
    },
    Calendar: {
      screen: Calendar,
    },
  },
  {
    navigationOptions: {
      gesturesEnabled: true,
    },
    mode: 'modal',
    headerMode: 'none'
  }
);
