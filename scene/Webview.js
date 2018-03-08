import React from 'react';
import { View, StyleSheet, WebView } from 'react-native';

export default class Web extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: params.title,
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <WebView
          source={{ uri: this.props.navigation.state.params.url }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
