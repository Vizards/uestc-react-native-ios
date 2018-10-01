import React from 'react';
import {ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Alert, Linking, ActionSheetIOS} from 'react-native';
import {inject, observer} from "mobx-react/native";
import ImagePicker from 'react-native-image-crop-picker';
import Icon from "react-native-vector-icons/Ionicons";

@inject('rootStore')
@observer
export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarUrl: undefined,
      nickName: undefined,
      bio: undefined,
      data: {},
      modify: '',
      roomId: '',
    }
  }

  static navigationOptions = {
    title: '账号设定',
  };

  async modify(item) {
    this.setState({ modify: item });
  }

  async onBlur(item) {
    this.setState({ modify: '' });
    const userData = await this.props.rootStore.StorageStore.constructor.load('user');
    if (this.state[item].length >= 25) {
      await this.props.rootStore.UserStore.toast('warning', `⚠️ ${item} 字数不得超过 25`);
      await this.props.rootStore.UserStore.clearToast();
    }
    if (this.state[item] !== '' && this.state[item].length < 50) {
      await this.props.rootStore.UserStore.setProfile(userData.token, {
        [item]: this.state[item],
      });
      await this.getProfile();
    } else {
      this.setState({
        [item]: this.state.data[item],
      });
    }
  }

  onChangeName = (nickName) => {
    this.setState({ nickName: nickName.trim() });
  };

  onChangeBio = (bio) => {
    this.setState({ bio: bio.trim() });
  };

  async getProfile() {
    const userData = await this.props.rootStore.StorageStore.constructor.load('user');
    const userProfile = await this.props.rootStore.UserStore.profile(userData.token);
    this.setState({
      avatarUrl: userProfile.data.avatarUrl,
      nickName: userProfile.data.nickName,
      bio: userProfile.data.bio,
      data: userProfile.data,
    });
  }

  async _showActionSheet() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['从相册选取', '取消'],
      cancelButtonIndex: 1,
      title: '设置头像'
    }, async (buttonIndex) => {
      if (buttonIndex !== 1) {
        await this.setAvatar();
      }
    });
  }

  async requestPermission() {
    await Alert.alert(
      '授权请求',
      '\n设置头像需要相册权限，设好头像后您可在设置中关闭授权',
      [
        {text: '取消', style: 'cancel'},
        {text: '去授权', onPress: async () => {
            await Linking.openURL("App-Prefs:root=WIFI");
          }},
      ]
    )
  };

  async selectAvatar() {
    try {
      return await ImagePicker.openPicker({
        cropping: true,
        width: 72,
        height: 72,
        cropperCircleOverlay: true,
        cropperChooseText: '选择',
        cropperCancelText: '取消',
        loadingLabelText: '处理中',
        mediaType: 'photo',
        smartAlbums: ['RecentlyAdded', 'UserLibrary'],
        compressImageMaxWidth: 288,
        compressImageMaxHeight: 288,
        forceJpg: true,
      });
    } catch (e) {
      if (e.toString().includes('Cannot access images')) {
        await this.requestPermission();
      } else if (!e.toString().includes('User cancelled')){
        await this.props.rootStore.UserStore.toast('error', `💊 ${e.toString()}`);
        await this.props.rootStore.UserStore.clearToast();
      }
    }
  };

  async uploadAvatar(info) {
    const file = { uri: info.path, type: 'multipart/form-data', name: info.creationDate };
    let formData = new FormData();
    formData.append("smfile", file);
    const response = await fetch('https://sm.ms/api/upload', {
      method: 'POST',
      headers:{
        'Content-Type':'multipart/form-data',
      },
      body: formData,
    });
    return await response.json();
  }

  async setAvatar() {
    const result = await this.selectAvatar();
    if (result !== undefined) {
      if (result.size < 5242880) {
        await this.props.rootStore.LoadingStore.loading(true, '上传中');
        const response = await this.uploadAvatar(result);
        if (response.code !== 'success') {
          await this.props.rootStore.LoadingStore.loading(false);
          await this.props.rootStore.UserStore.toast('error', `💊 ${response.msg}`);
          await this.props.rootStore.UserStore.clearToast();
        } else {
          const userData = await this.props.rootStore.StorageStore.constructor.load('user');
          await Promise.all([
            this.setState({
              avatarUrl: response.data.url,
            }),
            this.props.rootStore.UserStore.setProfile(userData.token, {
              avatarUrl: response.data.url,
            }),
          ]);
          await this.getProfile();
          await this.props.rootStore.LoadingStore.loading(false);
        }
      } else {
        await this.props.rootStore.UserStore.toast('error', '💊 文件太大，裁剪一下或者换一张小于 5M 的图片吧');
        await this.props.rootStore.UserStore.clearToast();
      }
    }
  }

  async changeXifu(xifuUser) {
    if (xifuUser === '') await this.props.navigation.navigate('Card');
    if (xifuUser !== '') await Alert.alert(
      '确认退出吗？',
      '\n退出后，您需要重新登录喜付才能查看一卡通和电费信息',
      [
        {text: '取消', style: 'cancel'},
        {text: '确定', onPress: async () => {
            await this.props.rootStore.StorageStore.constructor.remove('xifu');
            await this.props.rootStore.StorageStore.constructor.remove('roomId');
            await this.props.rootStore.xiFuStore.setBind(false, '');
            await this.setState({ roomId: '未知' });
            await this.props.rootStore.UserStore.toast('success', '🎉 已成功退出登录');
            await this.props.rootStore.UserStore.clearToast();
          }},
      ]
    )
  }

  async changeRoom() {
    if (this.state.roomId !== '未知') {
      await this.props.navigation.navigate('ChangeRoom');
    } else {
      await this.props.rootStore.UserStore.toast('info', '🍭 请先绑定喜付账户');
      await this.props.rootStore.UserStore.clearToast();
    }
  }

  async getRoomId() {
    try {
      const roomId = await this.props.rootStore.StorageStore.constructor.load('roomId');
      this.setState({ roomId });
    } catch (e) {
      this.setState({ roomId: '未知' });
    }
  }

  async exit() {
    await Alert.alert(
      '确认退出吗？',
      '\n退出后将清除您的缓存数据，并要求您重新登录',
      [
        {text: '取消', style: 'cancel'},
        {text: '确定', onPress: async () => {
            await this.props.rootStore.StorageStore.constructor.remove('user');
            await this.props.rootStore.StorageStore.constructor.remove('course');
            await this.props.rootStore.StorageStore.constructor.remove('exam');
            await this.props.rootStore.StorageStore.constructor.remove('grade');
            await this.props.rootStore.StorageStore.constructor.remove('gpa');
            await this.props.rootStore.StorageStore.constructor.remove('allGrade');
            await this.props.rootStore.StorageStore.constructor.remove('xifu');
            await this.props.rootStore.StorageStore.constructor.remove('roomId');
            await this.props.rootStore.xiFuStore.setBind(false, '');
            await this.props.rootStore.UserStore.toast('success', '🎉 已成功退出当前账号，请重新登录');
            await this.props.rootStore.UserStore.clearToast();
            await this.props.navigation.navigate('Login');
          }},
      ]
    )
  }

  async delete() {
    await Alert.alert(
      '确认删除吗？',
      '\n为保证为本人操作，此操作需要确认您的教务系统账户密码',
      [
        {text: '取消', style: 'cancel'},
        {text: '确定', onPress: async () => {
            await this.props.navigation.navigate('Confirm');
          }},
      ]
    )
  }

  async componentDidMount() {
    await this.props.rootStore.LoadingStore.loading(true, '同步中...');
    // 从 mobx 获取 user porfile
    // 如果没有就从云端拉取
    try {
      const userProfile = this.props.rootStore.UserStore.allData.profile;
      this.setState({
        avatarUrl: userProfile.data.avatarUrl,
        nickName: userProfile.data.nickName,
        bio: userProfile.data.bio,
        data: userProfile.data,
      });
    } catch (e) {
      await this.getProfile();
    }

    // 从存储拉喜付绑定状态
    // 如果没有就从 store 里取
    try {
      const xiFuData = await this.props.rootStore.StorageStore.constructor.load('xifu');
      await this.props.rootStore.xiFuStore.setBind(true, xiFuData.username);
      await this.setState({
        xiFuUser: xiFuData.username,
      });
    } catch (err) {
      await this.setState({
        xiFuUser: this.props.rootStore.xiFuStore.allData.xiFuUser,
      })
    }

    await this.getRoomId();
    await this.props.rootStore.LoadingStore.loading(false);
  }

  render() {
    const hash = {
      avatarUrl: '头像',
      nickName: '昵称',
      bio: '个性签名',
      stuID: '学号',
      stuName: '姓名',
      enName: '英文名',
      gender: '性别',
      grade: '所在年级',
      plan: '学制',
      project: '项目',
      level: '学历层次',
      category: '学生类别',
      department: '院系',
      profession: '专业',
      direction: '专业方向',
      enrollDate: '入校时间',
      graduateDate: '应毕业时间',
      manager: '行政管理院系',
      waysOfLearning: '学习形式',
      eduForm: '教育形式',
      status: '学籍状态',
      registered: '是否在籍',
      atSchool: '是否在校',
      class: '行政班级',
      campus: '所属校区',
    };

    const Info = () => Object.keys(this.state.data).map((item, key) => {
      if (key !== 0 && key !== 1 && key !== 2) {
        return <View key={key} style={[styles.item, item === 'campus' && styles.last]}>
          <Text style={styles.leftText}>{hash[item]}</Text>
          <Text style={styles.rightText}>{this.state.data[item]}</Text>
        </View>
      }
    });

    return (
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>个人设定</Text>
        <View style={styles.container}>
          <TouchableOpacity style={styles.touchable} onPress={this._showActionSheet.bind(this)}>
            <Text style={styles.leftText}>头像</Text>
            {this.state.avatarUrl === undefined ? <Text style={styles.rightText}>点击设置</Text> : <Image source={{ uri: this.state.avatarUrl }} resizeMode='contain' style={styles.logo}/>}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.touchable, this.state.modify === 'nickName' && styles.edit]}
            onPress={this.modify.bind(this, 'nickName')}
          >
            <Text style={styles.leftText}>{hash['nickName']}</Text>
            {this.state.modify === 'nickName' ?
              <TextInput
                style={styles.Input}
                editable={true}
                keyboardType='default'
                maxLength={25}
                autoFocus
                placeholder='输入昵称'
                returnKeyType='done'
                onChangeText={this.onChangeName}
                onBlur={() => this.onBlur('nickName')}
              /> :
              <Text style={styles.rightText}>{this.state.nickName === undefined ? '点击设置' : this.state.nickName}</Text>
            }
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.touchable, this.state.modify === 'bio' && styles.edit]}
            onPress={this.modify.bind(this, 'bio')}
          >
            <Text style={styles.leftText}>{hash['bio']}</Text>
            {this.state.modify === 'bio' ?
              <TextInput
                style={styles.Input}
                editable={true}
                keyboardType='default'
                maxLength={25}
                autoFocus
                placeholder='输入个性签名'
                returnKeyType='done'
                onChangeText={this.onChangeBio}
                onBlur={() => this.onBlur('bio')}
              /> :
              <Text style={styles.rightText}>{this.state.bio === undefined ? '点击设置' : this.state.bio}</Text>
            }
          </TouchableOpacity>
          <TouchableOpacity style={styles.touchable} onPress={this.changeXifu.bind(this, this.state.xiFuUser)}>
            <Text style={styles.leftText}>喜付账户</Text>
            <Text style={styles.rightText}>{this.props.rootStore.xiFuStore.allData.xiFuBind === false && this.props.rootStore.xiFuStore.allData.xiFuUser === '' ? '点击绑定' : this.state.xiFuUser}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.touchable, styles.last]} onPress={this.changeRoom.bind(this)}>
            <Text style={styles.leftText}>宿舍</Text>
            <Text style={styles.rightText}>{this.state.roomId}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>账户管理</Text>
        <View style={styles.container}>
          <TouchableOpacity style={styles.touchable} onPress={this.exit.bind(this)}>
            <Text style={styles.leftText}>退出登录</Text>
            <Icon style={styles.rightIcon} name="ios-arrow-forward" size={21}/>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.touchable, styles.last]} onPress={this.delete.bind(this)}>
            <Text style={styles.leftText}>删除账户</Text>
            <Icon style={styles.rightIcon} name="ios-arrow-forward" size={21}/>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>学籍信息(不可修改)</Text>
        <View style={styles.container}>
          <Info/>
        </View>
        <Text style={styles.note}>我们不收集或共享您的个人信息</Text>
      </ScrollView>
    )
  }
}

const $white = '#fff';
const $titleColor = 'rgb(109, 109, 114)';
const $borderColor = 'rgb(200, 199, 204)';
const $text = 'rgb(3,3,3)';
const $gray = 'rgb(143, 142, 148)';
const styles = StyleSheet.create({
  scrollView: {
    height: '100%',
  },
  container: {
    paddingLeft: 15,
    backgroundColor: $white,
    borderBottomWidth: 0.5,
    borderBottomColor: $borderColor,
    borderTopWidth: 0.5,
    borderTopColor: $borderColor,
  },
  title: {
    paddingLeft: 15,
    paddingTop: 15,
    paddingBottom: 7,
    color: $titleColor
  },
  touchable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15,
    paddingTop: 13,
    paddingBottom: 13,
    borderBottomWidth: 0.5,
    borderBottomColor: $borderColor,
  },
  edit: {
    justifyContent: 'flex-start',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: $borderColor,
    height: 44,
  },
  last: {
    borderBottomWidth: 0,
  },
  leftText: {
    fontSize: 17,
    color: $text,
  },
  Input: {
    marginLeft: 15,
    width: '100%'
  },
  rightText: {
    fontSize: 14,
    color: $gray,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  rightIcon: {
    color: $gray,
  },
  note: {
    paddingBottom: 20,
    textAlign: 'center',
    paddingTop: 20,
    color: $titleColor
  }
});