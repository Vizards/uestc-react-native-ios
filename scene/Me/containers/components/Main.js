import React from 'react';
import { Text, ScrollView, View, SectionList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { inject, observer } from "mobx-react/native";
import config from "../../../../config";

@inject('rootStore')
@observer
class Main extends React.Component {

  _renderItem = (info) => {
    if (info.section.key === 'tool') return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => this.props.navigation.navigate('WebView', {
          title: info.item.name,
          url: info.item.url,
        })}
      >
        <View style={styles.inner}>
          <View style={styles.left}>
            <Ionicons name={info.item.icon} size={24} color={info.item.color} style={styles.icon}/>
            <Text style={styles.text}>{info.item.name}</Text>
          </View>
          <Ionicons style={styles.rightIcon} name="ios-arrow-forward" size={21}/>
        </View>
      </TouchableOpacity>
    );

    if (info.section.key === 'account') return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => Alert.alert(
          info.item.data.title,
          info.item.data.detail,
          [
            {text: '取消', style: 'cancel'},
            {text: '确定', onPress: async () => {
              if (info.item.data.type === 'delete') {
                await this.props.navigation.push('Confirm');
              } else {
                await this.props.rootStore.StorageStore.constructor.remove('user');
                await this.props.rootStore.StorageStore.constructor.remove('course');
                await this.props.rootStore.StorageStore.constructor.remove('exam');
                await this.props.rootStore.StorageStore.constructor.remove('grade');
                await this.props.rootStore.StorageStore.constructor.remove('gpa');
                await this.props.rootStore.StorageStore.constructor.remove('allGrade');
                await this.props.rootStore.StorageStore.constructor.remove('xifu');
                await this.props.rootStore.xiFuStore.setBind(false, '');
                await this.props.rootStore.UserStore.toast('success', '已成功退出当前账号，请重新登录');
                await this.props.rootStore.UserStore.clearToast();
                await this.props.navigation.push('Login')
              }
            }},
          ]
        )}
      >
        <View style={styles.inner}>
          <View style={styles.left}>
            <Ionicons name={info.item.icon} size={24} color={info.item.color} style={styles.icon}/>
            <Text style={styles.text}>{info.item.name}</Text>
          </View>
          <Ionicons style={styles.rightIcon} name="ios-arrow-forward" size={21}/>
        </View>
      </TouchableOpacity>
    )
  };

  _sectionComp = () => {
    return <Text style={styles.title} />;
  };

  _extraUniqueKey = (item, index) => {
    return "index" + index + item;
  };

  render() {
    return (
      <ScrollView>
        <SectionList
          renderSectionHeader={this._sectionComp}
          renderItem={this._renderItem}
          keyExtractor = {this._extraUniqueKey}
          sections={
            [{
              key: 'tool',
              data: [
                {name: '班车信息', url: `${config.domain}/api/extra/traffic`, icon: 'ios-bus', color: '#51c733'},
                {name: '教务处学生公告', url: `${config.domain}/api/extra/notification`, icon: 'ios-notifications', color: '#fdc600'},
                {name: '学院教务科信息', url: `${config.domain}/api/extra/contact`, icon: 'ios-contact', color: '#c5cfd4'},
                {name: '学校部门信息', url: `${config.domain}/api/extra/dept`, icon: 'ios-information-circle', color: '#239ff4'},
              ]
            }, {
              key: 'account',
              data: [
                {name: '退出登录', data: { title: '确认退出吗？', detail: '\n退出后将清除您的缓存数据，并要求您重新登录', type: 'exit', }, icon: 'ios-exit', color: '#fdc600'},
                {name: '删除账户', data: { title: '确认删除吗？', detail: '\n为保证为本人操作，此操作需要确认您的教务系统账户密码', type: 'delete' }, icon: 'ios-close-circle', color: 'rgb(217, 74, 74)'},
              ]
            }]
          }
        />
      </ScrollView>
    );
  }
}

export default withNavigation(Main);

const $frontColor = '#fff';
const $borderColor = 'rgb(200, 199, 204)';
const $title = 'rgb(3,3,3)';
const $gray = 'rgb(143, 142, 148)';
const styles = StyleSheet.create({
  card: {
    backgroundColor: $frontColor,
    paddingLeft: 15,
    height: 54,
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: $borderColor,
    height: 54,
  },
  left: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  icon: {
    paddingTop: 4,
    width: 24,
  },
  text: {
    fontSize: 17,
    color: $title,
    paddingLeft: 10,
  },
  rightIcon: {
    paddingRight: 16,
    color: $gray,
  }
});
