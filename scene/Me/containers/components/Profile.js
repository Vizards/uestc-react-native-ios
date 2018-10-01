import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import { inject, observer } from "mobx-react/native";
import Icon from "react-native-vector-icons/Ionicons";

@inject('rootStore')
@observer
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      xiFuUser: '',
    }
  }

  async componentWillMount() {
    const userData = await this.props.rootStore.StorageStore.constructor.load('user');
    await this.props.rootStore.UserStore.profile(userData.token);
    try {
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
    const profileData = this.props.rootStore.UserStore.allData.profile.data;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          this.props.navigation.navigate('Profile')
        }}
      >
        <View style={styles.profile}>
          <Image source={profileData !== undefined && profileData.avatarUrl !== undefined ? { uri: profileData.avatarUrl } : require('./uestc.png') } style={styles.logo} resizeMode='contain'/>
          <View style={styles.info}>
            <Text style={styles.user}>{profileData !== undefined && profileData.nickName !== undefined ? profileData.nickName : 'Anonymous'}</Text>
            <Text style={styles.xiFu}>{profileData !== undefined && profileData.bio !== undefined ? profileData.bio : this.props.rootStore.xiFuStore.allData.xiFuBind === false && this.props.rootStore.xiFuStore.allData.xiFuUser === '' ? '未绑定喜付账户' : `已绑定喜付账户 ${this.state.xiFuUser}`}</Text>
          </View>
          <Icon style={styles.rightIcon} name="ios-arrow-forward" size={21}/>
        </View>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(Profile);

const $backgroundColor = '#fff';
const $gray = 'rgb(143, 142, 148)';
const $borderColor = 'rgb(200, 199, 204)';
const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: $backgroundColor,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 14,
    borderTopWidth: 0.5,
    borderTopColor: $borderColor,
    borderBottomWidth: 0.5,
    borderBottomColor: $borderColor,
  },
  profile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flexGrow: 1,
  },
  logo: {
    width: 72,
    height: 72,
    marginRight: 16,
    borderRadius: 36,
  },
  user: {
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '500',
  },
  xiFu: {
    fontSize: 13,
    lineHeight: 25,
  },
  rightIcon: {
    color: $gray,
  }
});
