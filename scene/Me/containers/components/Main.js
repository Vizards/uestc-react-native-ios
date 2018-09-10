import React from 'react';
import { Text, ScrollView, View, SectionList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { inject, observer } from "mobx-react/native";
import CookieManager from 'react-native-cookies';
import config from "../../../../config";

@inject('rootStore')
@observer
class Main extends React.Component {

  // 登录超新电子图书馆
  async getSiteCookies() {
    const Uri = config.libraryIndex;
    const Header = {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'DNT': '1',
        'Host': 'm.5read.com',
        'Pragma': 'no-cache',
        'Referer': 'http://222.197.165.97:8080/sms/opac/search/showSearch.action?xc=5',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
      }
    };

    try {
      const response = await fetch(Uri, Header);
      return response.headers.get('Set-Cookie');
    } catch (err) {
      await this.props.rootStore.UserStore.toast('error', '💊 无法访问图书馆页面，请检查网络连接');
      await this.props.rootStore.UserStore.clearToast();
    }
  }

  async libraryLogin(cookie) {
    const userData = await this.props.rootStore.StorageStore.constructor.load('user');
    const params = {
      'schoolid': '627',
      'backurl': '/user/uc/showOpacinfo.jspx',
      'userType': '0',
      'username': userData.username,
      'password': userData.password
    };
    const Uri = config.libraryLogin;
    const Header = {
      method: 'POST',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Cookie': cookie,
        'Host': 'mc.m.5read.com',
        'Origin': 'http://mc.m.5read.com',
        'Pragma': 'no-cache',
        'Referer': 'http://mc.m.5read.com/user/login/showLogin.jspx?backurl=%2Fuser%2Fuc%2FshowOpacinfo.jspx',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
      },
      body: Object.keys(params).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
      }).join('&'),
    };

    try {
      await fetch(Uri, Header);
    } catch (err) {
      await this.props.rootStore.UserStore.toast('error', '💊 无法登录到图书馆，请确认您处于学校内网');
      await this.props.rootStore.UserStore.clearToast();
    }
  }

  async navigateToLibrary() {
    await this.props.rootStore.LoadingStore.loading(true, '自动登录中');
    const initCookie = await this.getSiteCookies();
    await this.libraryLogin(initCookie);
    await CookieManager.getAll();
    await this.props.navigation.navigate('WebView', {
      url: 'http://222.197.165.97:8080/sms/opac/search/showSearch.action?xc=5',
      title: '电子科技大学图书馆',
      sendCookies: true
    });
    await this.props.rootStore.LoadingStore.loading(false, '');
  };

  _renderItem = (info) => {
    console.log(info);
    if (info.section.key === 'tool') return (
      <TouchableOpacity
        style={[styles.card, info.index === 0 && styles.firstCard, info.index === info.section.data.length - 1 && styles.lastCard]}
        onPress={async () => {if (info.item.page === 'announcement') {
          this.props.navigation.navigate('Office', {type: 'announcement'})
        } else if (info.item.page === 'query') {
          this.props.navigation.navigate('Office', {type: 'query'})
        } else if (info.item.page === 'library') {
          await this.navigateToLibrary();
        } else this.props.navigation.navigate('WebView', {
          url: info.item.url,
          title: info.item.name,
          sendCookies: false
        })}}
      >
        <View style={[styles.inner, info.index === 0 && styles.firstInnerCard, info.index === info.section.data.length - 1 && styles.lastInnerCard]}>
          <View style={styles.left}>
            <Icon name={info.item.icon} size={24} color={info.item.color} style={styles.icon}/>
            <Text style={styles.text}>{info.item.name}</Text>
          </View>
          <Icon style={styles.rightIcon} name="ios-arrow-forward" size={21}/>
        </View>
      </TouchableOpacity>
    );

    if (info.section.key === 'account') return (
      <TouchableOpacity
        style={[styles.card, info.index === 0 && styles.firstCard, info.index === info.section.data.length - 1 && styles.lastCard]}
        onPress={() => Alert.alert(
          info.item.data.title,
          info.item.data.detail,
          [
            {text: '取消', style: 'cancel'},
            {text: '确定', onPress: async () => {
              if (info.item.data.type === 'delete') {
                await this.props.navigation.navigate('Confirm');
              } else {
                await this.props.rootStore.StorageStore.constructor.remove('user');
                await this.props.rootStore.StorageStore.constructor.remove('course');
                await this.props.rootStore.StorageStore.constructor.remove('exam');
                await this.props.rootStore.StorageStore.constructor.remove('grade');
                await this.props.rootStore.StorageStore.constructor.remove('gpa');
                await this.props.rootStore.StorageStore.constructor.remove('allGrade');
                await this.props.rootStore.StorageStore.constructor.remove('xifu');
                await this.props.rootStore.xiFuStore.setBind(false, '');
                await this.props.rootStore.UserStore.toast('success', '🎉 已成功退出当前账号，请重新登录');
                await this.props.rootStore.UserStore.clearToast();
                await this.props.navigation.navigate('Login')
              }
            }},
          ]
        )}
      >
        <View style={[styles.inner, info.index === 0 && styles.firstInnerCard, info.index === info.section.data.length - 1 && styles.lastInnerCard]}>
          <View style={styles.left}>
            <Icon name={info.item.icon} size={24} color={info.item.color} style={styles.icon}/>
            <Text style={styles.text}>{info.item.name}</Text>
          </View>
          <Icon style={styles.rightIcon} name="ios-arrow-forward" size={21}/>
        </View>
      </TouchableOpacity>
    );

    if (info.section.key === 'about') return (
      <TouchableOpacity
        style={[styles.card, info.index === 0 && styles.firstCard, info.index === info.section.data.length - 1 && styles.lastCard]}
        onPress={() => {if (info.item.name === '关于') {
          this.props.navigation.navigate('About')
        } else if (info.item.name === '公告') {
          this.props.navigation.navigate('WebView', {
            title: '公告',
            url: info.item.url,
            sendCookies: false
          })
        }}}
      >
        <View style={[styles.inner, info.index === 0 && styles.firstInnerCard, info.index === info.section.data.length - 1 && styles.lastInnerCard]}>
          <View style={styles.left}>
            <Icon name={info.item.icon} size={24} color={info.item.color} style={styles.icon}/>
            <Text style={styles.text}>{info.item.name}</Text>
          </View>
          <Icon style={styles.rightIcon} name="ios-arrow-forward" size={21}/>
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
          style={styles.sectionList}
          sections={
            [{
              key: 'tool',
              data: [
                {name: '班车信息', url: `${config.domain}/api/extra/traffic`, icon: 'ios-bus', color: '#51c733'},
                {name: '教务信息公告', page: 'announcement', icon: 'ios-notifications', color: '#fdc600'},
                {name: '教务服务指南', url: `${config.domain}/api/extra/info`, icon: 'ios-compass', color: '#c5cfd4'},
                {name: '快捷查询', page: 'query', icon: 'ios-information-circle', color: '#239ff4'},
                {name: '图书馆', page: 'library', icon: 'ios-book', color: '#ff7a78'}
              ]
            }, {
              key: 'account',
              data: [
                {name: '退出登录', data: { title: '确认退出吗？', detail: '\n退出后将清除您的缓存数据，并要求您重新登录', type: 'exit', }, icon: 'ios-exit', color: '#fdc600'},
                {name: '删除账户', data: { title: '确认删除吗？', detail: '\n为保证为本人操作，此操作需要确认您的教务系统账户密码', type: 'delete' }, icon: 'ios-close-circle', color: 'rgb(217, 74, 74)'},
              ]
            }, {
              key: 'about',
              data: [
                {name: '公告', url: 'https://uestc-announcement.surge.sh/', icon: 'ios-chatbubbles', color: '#51c733'},
                {name: '关于', page: 'About', icon: 'ios-paper-plane', color: '#239ff4'},
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
  sectionList: {
    marginBottom: 14,
  },
  card: {
    backgroundColor: $frontColor,
    paddingLeft: 15,
    height: 54,
  },
  firstCard: {
    borderTopWidth: 0.5,
    borderTopColor: $borderColor,
  },
  lastCard: {
    borderBottomWidth: 0.5,
    borderBottomColor: $borderColor,
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: $borderColor,
    height: 54,
  },
  firstInnerCard: {
    borderBottomWidth: 1,
  },
  lastInnerCard: {
    borderBottomWidth: 0,
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
