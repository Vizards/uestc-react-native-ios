import React from 'react';
import { Text, SafeAreaView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class Course extends React.Component {
  static navigationOptions = {
    headerTitle: '课程表',
    headerRight: <Ionicons name='ios-swap-outline' size={25}/>,
    headerStyle: {
      paddingRight: 15,
      paddingLeft: 15,
    }
  };

  render() {
    return (
      <SafeAreaView>
        <Text>Course!</Text>
      </SafeAreaView>
    );
  }
}
