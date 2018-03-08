import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Graph from './components/Graph';
import Bill from './components/Bill';

export default class Main extends React.Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        <Graph/>
        <Bill/>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
