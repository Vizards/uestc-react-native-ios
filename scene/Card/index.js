import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Login from "./containers/Login";
import Main from './containers/Main';

const XiFu = StackNavigator(
  {
    Main: {
      screen: Main,
    },
    XiFuLogin: {
      screen: Login,
    },
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
      <View style={styles.container}>
        <XiFu/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
