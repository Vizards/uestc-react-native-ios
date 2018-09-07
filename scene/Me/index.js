import React from 'react';
import { View, StyleSheet } from 'react-native';

import Profile from './containers/components/Profile';
import Main from './containers/components/Main';

export default class Page extends React.Component {
  static navigationOptions = {
    headerTitle: '我的',
    headerLeft: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <Profile/>
        <Main/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
