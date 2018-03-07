import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation'

class Bill extends React.Component {
  render() {
    return (
      <View>
        <Text>Bill!</Text>
        <TouchableOpacity
          style={styles.Button}
          onPress={() => this.props.navigation.navigate('XiFuLogin')}
        >
          <Text style={styles.buttonText}>切换喜付账号</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(Bill);

const $textInputBackgroundColor = '#fff';
const $buttonBackgroundColor = 'rgb(96, 165, 246)';
const styles = StyleSheet.create({
  Button: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: $buttonBackgroundColor,
    borderRadius: 8,
  },
  buttonText: {
    color: $textInputBackgroundColor,
    fontSize: 15,
  },
});