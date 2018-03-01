import React from 'react';
import { StyleSheet, Dimensions, Text, View, ActivityIndicator } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class Loading extends React.Component {
  render() {
    return (
      <View style={styles.load_box}>
        <ActivityIndicator
          animating={true}
          color={'#fff'}
          size={'large'}
          style={styles.load_progress} />
        <Text style={styles.load_text}>{this.props.text}</Text>
      </View>
    )
  }
}

const $loadTextColor = '#fff';
const $loadBoxBackgroundColor = '#0008';
const styles = StyleSheet.create({
  load_box: {
    width: 100,
    height: 100,
    backgroundColor: $loadBoxBackgroundColor,
    alignItems: 'center',
    marginLeft: SCREEN_WIDTH / 2 - 50,
    marginTop: SCREEN_HEIGHT / 2 - 50,
    borderRadius: 10
  },
  load_progress: {
    position: 'absolute',
    width: 100,
    height: 90
  },
  load_text: {
    marginTop: 70,
    color: $loadTextColor,
  }
});
