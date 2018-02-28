import React from 'react';
import { StyleSheet } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Login from "./Login";
import TabNavigator from "./Main";

const LoginPage = StackNavigator(
  {
    Login: {
      screen: Login,
    },
    Main: {
      screen: TabNavigator,
    }
  },
);

export default class App extends React.Component {
  render() {
    return <LoginPage style={styles.screen}/>
  }
}

const $backgroundColor = 'rgb(239, 239, 244)';
const styles = StyleSheet.create({
  screen: {
    backgroundColor: $backgroundColor
  }
})
