import React from 'react';
import { Text, SafeAreaView } from 'react-native';

export default class Card extends React.Component {
  static navigationOptions = {
    headerTitle: '一卡通 & 电费'
  };

  render() {
    return (
      <SafeAreaView>
        <Text>Card!</Text>
      </SafeAreaView>
    );
  }
}
