import React from 'react';
import { Text, SafeAreaView } from 'react-native';

export default class Me extends React.Component {
  static navigationOptions = {
    headerTitle: '我'
  };

  render() {
    return (
      <SafeAreaView>
        <Text>Me!</Text>
      </SafeAreaView>
    );
  }
}
