import React from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Toaster from 'react-native-toaster';

import Login from "./scene/Login";
import TabNavigator from "./Main";

import Loading from './common/components/Loading';


import { inject, observer } from 'mobx-react/native';

const App = StackNavigator(
  {
    Login: {
      screen: Login,
    },
    Main: {
      screen: TabNavigator,
    }
  },
);

@inject('rootStore')
@observer
export default class AppRoot extends React.Component {
  render() {
    const userStoreData = this.props.rootStore.UserStore.allData;
    const loadingData = this.props.rootStore.LoadingStore.allData;
    return (
      <View style={styles.screen}>
        <Toaster
          message={userStoreData.toastMessage}
        />
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={loadingData.loadingVisible}
        >
          <Loading text={loadingData.loadingText}/>
        </Modal>
        <App />
      </View>
    )
  }
}

const $backgroundColor = 'rgb(239, 239, 244)';
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: $backgroundColor
  }
});