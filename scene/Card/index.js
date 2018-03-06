import React from 'react';
import { View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Login from "./containers/Login";
import Main from './containers/Main';

const XiFu = StackNavigator(
  {
    Login: {
      screen: Login,
    },
    Main: {
      screen: Main,
    }
  },
  {
    navigationOptions: {
      headerStyle: {
        display: 'none'
      }
    },
    mode: 'modal',
  }
);

export default class Card extends React.Component {
  static navigationOptions = {
    headerTitle: '一卡通 & 电费'
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <XiFu/>
      </View>
    );
  }
}
