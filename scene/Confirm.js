import React from 'react';
import { ScrollView, TextInput, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { inject, observer } from 'mobx-react/native';

@inject('rootStore')
@observer
class Confirm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  }

  static navigationOptions = {
    headerTitle: '删除账户',
  };

  onChangeUsername = (username) => {
    this.setState({ username });
  };

  onChangePassword = (password) => {
    this.setState({ password });
  };

  async onBlur(type) {
    if (type === 'username') {
      this.state.username.length !== 13 && this.state.username.length !== 0 ? await this.props.rootStore.UserStore.toast('error', '⚠️ 学号是 13 个数字，请检查您的输入') : null;
      await this.props.rootStore.UserStore.clearToast();
    }
    if (type === 'password') {
      this.state.password.length < 6 && this.state.password.length !== 0 ? await this.props.rootStore.UserStore.toast('error', '⚠️ 密码不得少于 6 位') : null;
      await this.props.rootStore.UserStore.clearToast();
    }
  };

  async onLogin() {
    await this.props.rootStore.LoadingStore.loading(true, '注销中');
    const responseJson = await this.props.rootStore.UserStore.delete(this.state.username, this.state.password);
    if (responseJson.code === 201) {
      await this.props.rootStore.StorageStore.constructor.remove('user');
      await this.props.rootStore.StorageStore.constructor.remove('course');
      await this.props.rootStore.StorageStore.constructor.remove('exam');
      await this.props.rootStore.StorageStore.constructor.remove('grade');
      await this.props.rootStore.StorageStore.constructor.remove('gpa');
      await this.props.rootStore.StorageStore.constructor.remove('allGrade');
      await this.props.rootStore.StorageStore.constructor.remove('xifu');
      await this.props.rootStore.xiFuStore.setBind(false, '');
      await this.props.rootStore.LoadingStore.loading(false);
      await this.props.rootStore.UserStore.toast('success', '🎉 注销成功！');
      await this.props.rootStore.UserStore.clearToast();
      await this.props.navigation.push('Login');
    } else {
      await this.props.rootStore.LoadingStore.loading(false);
      await this.props.rootStore.UserStore.toast('error', '💊 无法注销您的账户，请确认您的学号密码是否正确');
      await this.props.rootStore.UserStore.clearToast();
    }

  };

  render() {
    const buttonDisabled = this.state.username.length !== 13 || this.state.password.length < 6;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          style={styles.Input}
          blurOnSubmit
          keyboardType='numeric'
          maxLength={13}
          placeholder='13 位学号'
          onChangeText={this.onChangeUsername}
          onBlur={() => this.onBlur('username')}
        />
        <TextInput
          style={styles.Input}
          blurOnSubmit
          secureTextEntry
          placeholder='统一身份认证系统密码'
          onChangeText={this.onChangePassword}
          onBlur={() => this.onBlur('password')}
        />
        <TouchableOpacity
          style={[styles.Button, buttonDisabled && styles.buttonDisabled]}
          onPress={this.onLogin.bind(this)}
          disabled={buttonDisabled}
        >
          <Text style={styles.buttonText}>删除账户</Text>
        </TouchableOpacity>
        <View style={styles.note}>
          <Text style={styles.text}>· 此操作将删除您的所有个人数据，并退出登录</Text>
          <Text style={styles.text}>· 不会影响您的教务系统账户和喜付账户，您稍后仍可以重新登录和绑定</Text>
          <Text style={styles.text}>· 为确保此操作是您本人所为，需要确认您的统一身份认证系统账号和密码</Text>
          <Text style={styles.text}>· 删除账户后，云端将不再保存有关您的任何信息</Text>
        </View>
      </ScrollView>
    )
  }
}

export default withNavigation(Confirm);

const $textInputBackgroundColor = '#fff';
const $textInputBorderColor = 'rgba(200, 199, 204, 0.5)';
const $buttonBackgroundColor = 'rgb(217, 74, 74)';
const $buttonDisabledBackgroundColor = 'rgba(217, 74, 74, 0.5)';
const $noteTextColor = 'rgb(143, 142, 148)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: 21,
    paddingRight: 21,
    paddingTop: 15,
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
    width: '100%',
    paddingTop: 30,
  },
  text: {
    color: $noteTextColor,
    paddingTop: 10,
  }
});
