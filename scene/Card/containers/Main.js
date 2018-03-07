import React from 'react';
import { Text, View } from 'react-native';
import Graph from './components/Graph';
import Bill from './components/Bill';

export default class Main extends React.Component {
  render() {
    return (
      <View>
        <Graph/>
        <Bill/>
      </View>
    );
  }
}