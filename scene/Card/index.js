import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Login from "./containers/Login";
import Main from './containers/Main';
import { inject, observer } from "mobx-react/native";
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
      }
    },
    mode: 'modal',
  }
);

@inject('rootStore')
@observer
class Card extends React.Component {
  static navigationOptions = {
    headerTitle: '一卡通 & 电费'
  };

  async handleRedirectLogin() {
    await this.props.rootStore.LoadingStore.loading(false);
    await this.props.navigation.navigate('Login');
  }

  async componentWillMount() {
    try {
      const lastLoginData = await this.props.rootStore.StorageStore.constructor.load('xifu');
      if (lastLoginData.username.length !== 11) {
        await this.handleRedirectLogin();
      }
    } catch (err) {
      await this.handleRedirectLogin();
    }
  }

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
