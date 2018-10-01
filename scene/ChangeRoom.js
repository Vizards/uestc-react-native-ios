import React from 'react';
import {ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import {inject, observer} from "mobx-react/native";

@inject('rootStore')
@observer
export default class changeRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: '',
    }
  }

  static navigationOptions = {
    title: '换绑宿舍',
  };

  onChangeText = (room) => {
    this.setState({ room });
  };

  async bindRoom() {
    try {
      await this.props.rootStore.LoadingStore.loading(true, '绑定中');
      const userData = await this.props.rootStore.StorageStore.constructor.load('user');
      const response = await this.props.rootStore.UserStore.electricity(userData.token, this.state.room);
      if (response.data.existRoom === '1' && response.data.room === this.state.room) {
        await this.props.rootStore.UserStore.toast('success', '🎉 换绑成功！');
        await this.props.rootStore.UserStore.clearToast();
        await this.props.navigation.navigate('Card');
      } else {
        await this.props.rootStore.UserStore.toast('error', '💊 房间号不存在或绑定过程中出错');
        await this.props.rootStore.UserStore.clearToast();
      }
      await this.props.rootStore.LoadingStore.loading(false);
    } catch (err) {
      await this.props.rootStore.UserStore.toast('error', '💊 暂时无法绑定，请稍后重试');
      await this.props.rootStore.UserStore.clearToast();
    }
  }

  async onPress() {
    if (this.state.room.length !== 6) {
      await this.props.rootStore.UserStore.toast('error', '⚠️ 房间号格式不正确，请检查您的输入');
      await this.props.rootStore.UserStore.clearToast()
    } else {
      await this.bindRoom();
    }
  }

  render() {
    const buttonDisabled = this.state.room.length !== 6;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          style={styles.Input}
          blurOnSubmit
          keyboardType='numeric'
          maxLength={6}
          autoFocus
          placeholder='宿舍房间号'
          onChangeText={this.onChangeText}
        />
        <TouchableOpacity
          style={[styles.Button, buttonDisabled && styles.buttonDisabled]}
          onPress={this.onPress.bind(this)}
          disabled={buttonDisabled}
        >
          <Text style={styles.buttonText}>绑定</Text>
        </TouchableOpacity>
        <View style={styles.note}>
          <Text style={styles.noteTitle}>宿舍房间号规则：</Text>
          <Text style={styles.noteText}>学历+楼栋号+房间号</Text>
          <Text style={styles.noteText}>本科生学历为 1</Text>
          <Text style={styles.noteText}>例如，您住在本科 3 栋 101 房间，则宿舍房间号为 103101</Text>
        </View>
      </ScrollView>
    )
  }
}

const $textInputBackgroundColor = '#fff';
const $textInputBorderColor = 'rgba(200, 199, 204, 0.5)';
const $noteTextColor = '#a7a7a7';
const $noteTitleColor = '#000';
const $buttonBackgroundColor = 'rgb(96, 165, 246)';
const $buttonDisabledBackgroundColor = 'rgba(96, 165, 246, 0.5)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: 21,
    paddingRight: 21,
    paddingTop: 20,
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
    paddingTop: 20,
  },
  noteTitle: {
    color: $noteTitleColor,
    fontWeight: 'bold',
    paddingBottom: 10,
    fontSize: 14,
  },
  noteText: {
    color: $noteTextColor,
    fontSize: 12,
    paddingBottom: 5,
  }
});