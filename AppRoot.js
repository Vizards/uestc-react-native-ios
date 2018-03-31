import React from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Toaster from 'react-native-toaster';

import Loading from './common/components/Loading';
import Login from "./scene/Login";
import Confirm from "./scene/Confirm";
import About from './scene/About';
import OpenSource from "./scene/OpenSource";
import TabNavigator from "./Main";

import { inject, observer } from 'mobx-react/native';

const App = StackNavigator(
  {
    Main: {
      screen: TabNavigator,
      navigationOptions: {
        headerLeft: null,
        gesturesEnabled: false,
      },
    },
    Login: {
      screen: Login,
      navigationOptions: {
        headerLeft: null,
        gesturesEnabled: false,
      },
    },
    Confirm: {
      screen: Confirm,
    },
    About: {
      screen: About,
    },
    OpenSource: {
      screen: OpenSource,
    }
  },
  {
    mode: 'card',
  }
);

@inject('rootStore')
@observer
export default class AppRoot extends React.Component {

  async componentWillMount() {
    // await this.props.rootStore.StorageStore.constructor.remove('user');
    // await this.props.rootStore.StorageStore.constructor.remove('course');
    // await this.props.rootStore.StorageStore.constructor.remove('exam');
    // await this.props.rootStore.StorageStore.constructor.remove('grade');
    // await this.props.rootStore.StorageStore.constructor.remove('gpa');
    // await this.props.rootStore.StorageStore.constructor.remove('allGrade');
    // await this.props.rootStore.StorageStore.constructor.remove('xifu');

    try {
      const lastLoginData = await this.props.rootStore.StorageStore.constructor.load('xifu');
      if (lastLoginData.username.length === 11) {
        await this.props.rootStore.xiFuStore.setBind(true, lastLoginData.username);
      }
    } catch (err) {
      return false;
    }
  }

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