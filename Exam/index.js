import React from 'react';
import { Text, SafeAreaView } from 'react-native';

export default class Exam extends React.Component {
  static navigationOptions = {
    headerTitle: '考试 & 成绩'
  };

  render() {
    return (
      <SafeAreaView>
        <Text>Exam!</Text>
      </SafeAreaView>
    );
  }
}
