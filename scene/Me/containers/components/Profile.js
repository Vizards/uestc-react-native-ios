import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { inject, observer } from "mobx-react/native";

@inject('rootStore')
@observer
export default class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      xiFuUser: '',
    }
  }

  async componentWillMount() {
    try {
      const userData = await this.props.rootStore.StorageStore.constructor.load('user');
      const xiFuData = await this.props.rootStore.StorageStore.constructor.load('xifu');
      await this.props.rootStore.xiFuStore.setBind(true, xiFuData.username);
      await this.setState({
        userData,
        xiFuUser: xiFuData.username,
      });
    } catch (err) {
      const userData = await this.props.rootStore.StorageStore.constructor.load('user');
      await this.setState({
        userData,
        xiFuUser: this.props.rootStore.xiFuStore.allData.xiFuUser,
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.profile}>
          <Image source={require('./uestc.png')} style={styles.logo} resizeMode='contain'/>
          <View style={styles.info}>
            <Text style={styles.user}>{this.state.userData.username}</Text>
            <Text style={styles.xiFu}>{this.props.rootStore.xiFuStore.allData.xiFuBind === false && this.props.rootStore.xiFuStore.allData.xiFuUser === '' ? '未绑定喜付账户' : `已绑定喜付账户 ${this.state.xiFuUser}`}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const $backgroundColor = '#fff';
const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: $backgroundColor,
    paddingTop: 15,
    paddingBottom: 15,
  },
  profile: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 16.7,
  },
  info: {
    width: '100%',
  },
  logo: {
    width: 72,
    height: 72,
    marginRight: 16,
  },
  user: {
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '500',
  },
  xiFu: {
    fontSize: 13,
    lineHeight: 25,
  }
});
