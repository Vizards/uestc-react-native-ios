import React from 'react';
import { TextInput, TouchableOpacity, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { withNavigation } from 'react-navigation';
import { inject, observer } from 'mobx-react/native';

@inject('rootStore')
@observer
class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  onChangeUsername = (username) => {
    this.setState({ username });
  };

  onChangePassword = (password) => {
    this.setState({ password });
  };

  async onBlur(type) {
    if (type === 'username') {
      this.state.username.length !== 11 && this.state.username.length !== 0 ? await this.props.rootStore.UserStore.toast('error', '⚠️ 手机号格式错误') : null;
      await this.props.rootStore.UserStore.clearToast();
    }
    if (type === 'password') {
      this.state.password.length < 6 && this.state.password.length !== 0 ? await this.props.rootStore.UserStore.toast('error', '⚠️ 密码为 6 到 16 位字母或数字') : null;
      await this.props.rootStore.UserStore.clearToast();
    }
  };

  async onLogin() {
    await this.props.rootStore.LoadingStore.loading(true, '登录中...');
    const userData = await this.props.rootStore.StorageStore.constructor.load('user');
    const responseJson = await this.props.rootStore.UserStore.bind(this.state.username, this.state.password, userData.token);
    await this.props.rootStore.LoadingStore.loading(false);
    if (responseJson.code === 403) {
      await this.props.rootStore.UserStore.toast('error', `💊 ${responseJson.err}`);
      await this.props.rootStore.UserStore.clearToast();
    } else if (responseJson.code === 201) {
      try {
        await this.props.rootStore.StorageStore.save('xifu', {
          username: this.state.username,
          password: this.state.password,
          time: responseJson.time,
        });
        await this.props.rootStore.UserStore.toast('success', '🎉 登录成功！');
        await this.props.rootStore.UserStore.clearToast();
        await this.props.rootStore.xiFuStore.setBind(true, this.state.username);
        // 使用正常导航方式会导致软键盘收起后再次弹出，mmp
        await this.props.navigation.replace('Main');
      } catch (err) {
        await this.props.rootStore.UserStore.toast('warning', '⚠️ 无法保存您的登录信息');
        await this.props.rootStore.UserStore.clearToast();
      }
    } else {
      await this.props.rootStore.UserStore.toast('error', '💊 暂时无法登录，请稍后再试');
      await this.props.rootStore.UserStore.clearToast();
    }
  };

  render() {
    const buttonDisabled = this.state.username.length !== 11 || this.state.password.length < 6;
    return (
      <ScrollView
        contentContainerStyle={styles.container}
      >
        <Image
          source={require('./xf_logo.png')}
          style={styles.logo}
          resizeMode='contain'
        />
        <TextInput
          style={styles.Input}
          blurOnSubmit
          keyboardType='numeric'
          maxLength={11}
          placeholder='喜付账号（11 位手机号码）'
          onChangeText={this.onChangeUsername}
          onBlur={() => this.onBlur('username')}
        />
        <TextInput
          style={styles.Input}
          blurOnSubmit
          secureTextEntry
          maxLength={16}
          placeholder='喜付登录密码'
          onChangeText={this.onChangePassword}
          onBlur={() => this.onBlur('password')}
        />
        <TouchableOpacity
          style={[styles.Button, buttonDisabled && styles.buttonDisabled]}
          onPress={this.onLogin.bind(this)}
          disabled={buttonDisabled}
        >
          <Text style={styles.buttonText}>绑定喜付账户</Text>
        </TouchableOpacity>
        <Text style={styles.note}>我们不收集或共享您的个人数据</Text>
      </ScrollView>
    )
  }
}

export default withNavigation(Login);

const $textInputBackgroundColor = '#fff';
const $textInputBorderColor = 'rgba(200, 199, 204, 0.5)';
const $noteTextColor = 'rgb(200, 199, 204)';
const $buttonBackgroundColor = 'rgb(96, 165, 246)';
const $buttonDisabledBackgroundColor = 'rgba(96, 165, 246, 0.5)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: 21,
    paddingRight: 21,
  },
  logo: {
    width: 90,
    height: 90,
    marginTop: 30,
    marginBottom: 30,
    alignItems: 'center',
  },
  Input: {
    height: 50,
    width: '100%',
    backgroundColor: $textInputBackgroundColor,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: $textInputBorderColor,
    borderRadius: 8,
    paddingLeft: 15,
    paddingRight: 5,
  },
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
  buttonDisabled: {
    backgroundColor: $buttonDisabledBackgroundColor,
  },
  note: {
    position: 'absolute',
    bottom: 20,
    fontSize: 12,
    color: $noteTextColor,
  },
});
