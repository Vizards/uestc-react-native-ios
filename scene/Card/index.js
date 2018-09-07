import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Login from "./containers/Login";
import Main from './containers/Main';
import { withNavigation } from 'react-navigation'

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
      },
      gesturesEnabled: false,
    },
    mode: 'modal',
  }
);

class Card extends React.Component {
  static navigationOptions = {
    headerTitle: '一卡通 & 电费',
    headerLeft: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <XiFu/>
      </View>
    );
  }
}

export default withNavigation(Card);

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
