import React from 'react';
import { View, StyleSheet } from 'react-native';
import { inject, observer } from 'mobx-react/native';

import LoginForm from './components/form';

@inject('rootStore')
@observer
export default class Login extends React.Component {
  static navigationOptions = {
    headerTitle: '登录',
    headerBackTitle: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <LoginForm/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
