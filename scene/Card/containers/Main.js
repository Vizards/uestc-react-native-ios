import React from 'react';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import Graph from './components/Graph';
import Bill from './components/Bill';
import { inject, observer } from "mobx-react/native";
import { withNavigation } from 'react-navigation'


@inject('rootStore')
@observer
class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
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

  async refresh() {
    await this.setState({ refreshing: true });
    const userData = await this.props.rootStore.StorageStore.constructor.load('user');
    await Promise.all([
      this.myGraph.getEcard(userData.token),
      this.myGraph.getElectricity(userData.token),
      this.myBill.getBill(userData.token),
    ]);
    await this.setState({ refreshing: false })
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this.refresh.bind(this)}
        />
        <Graph rootStore={this.props.rootStore} ref={(c) => {this.myGraph = c;}}/>
        <Bill rootStore={this.props.rootStore} ref={(c) => {this.myBill = c;}} navigation={this.props.navigation}/>
      </ScrollView>
    );
  }
}

export default withNavigation(Main);

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
