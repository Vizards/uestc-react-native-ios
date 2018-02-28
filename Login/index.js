import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import validate from 'mobx-form-validate';
import { observable, toJS } from 'mobx';
import {
  FormProvider,
  FormItem,
  Submit
} from './components/form';

class LoginForm {
  @observable
  @validate(/^[0-9]{13}$/, '请输入正确的学号')
  username = '';

  @observable
  @validate(/.{6,}$/, '密码不得少于 6 个字符')
  password = '';

  submit = async() => {
    // await post('/login', toJS(this));
    alert(JSON.stringify(toJS(this)));
  };
}

export default class Login extends React.Component {
  static navigationOptions = {
    headerTitle: '登录'
  };
  form = new LoginForm();
  render() {
    return (
      <FormProvider form={this.form}>
        <View style={styles.container}>
          <SafeAreaView>
            <FormItem blurOnSubmit keyboardType='numeric' name="username">学号</FormItem>
            <FormItem blurOnSubmit secureTextEntry name="password">密码</FormItem>
            <Submit onSubmit={this.form.submit}>Login</Submit>
          </SafeAreaView>
        </View>
      </FormProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
