import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Graph from './components/Graph';
import Bill from './components/Bill';
import { inject, observer } from "mobx-react/native";

@inject('rootStore')
@observer
export default class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      canLoad: false,
    }
  };

  async handleRedirectLogin() {
    await this.props.rootStore.LoadingStore.loading(false);
    await this.props.navigation.navigate('XiFuLogin');
  }

  async componentWillMount() {
    try {
      const lastLoginData = await this.props.rootStore.StorageStore.constructor.load('xifu');
      if (lastLoginData.username.length !== 11) {
        await this.handleRedirectLogin();
      }
    } catch (err) {
      await this.handleRedirectLogin();
    }
  }

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
