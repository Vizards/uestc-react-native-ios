import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, SectionList, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { inject, observer } from "mobx-react/native";

@inject('rootStore')
@observer
export default class About extends React.Component {
  static navigationOptions = {
    headerTitle: '关于',
  };

  _renderItem = (info) => {
    if (info.section.key === 'about') return (
      <TouchableOpacity
        style={styles.card}
        onPress={ async () => {
          if (info.item.type === 'app-store') {
            await this.props.rootStore.UserStore.toast('info', '🍭 暂未上架 App Store, 敬请期待');
            await this.props.rootStore.UserStore.clearToast();
          } else {
            Linking.canOpenURL(info.item.url).then(supported => {
              if (supported) Linking.openURL(info.item.url);
              if (!supported) {
                this.props.rootStore.UserStore.toast('warning', `⚠️ 请先安装${info.item.type}`);
                this.props.rootStore.UserStore.clearToast();
              }
            });
          }
        }}
      >
        <View style={styles.inner}>
          <View style={styles.left}>
            <Icon name={info.item.icon} size={24} color={info.item.color} style={styles.icon}/>
            <Text style={styles.text}>{info.item.name}</Text>
          </View>
          <Icon style={styles.rightIcon} name="ios-arrow-forward" size={21}/>
        </View>
      </TouchableOpacity>
    );

    if (info.section.key === 'thanks') return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (info.item.type === 'website') {
            Linking.canOpenURL(info.item.url).then(supported => {
              if (supported) Linking.openURL(info.item.url);
              if (!supported) {
                this.props.rootStore.UserStore.toast('warning', `⚠️ 请先安装浏览器`);
                this.props.rootStore.UserStore.clearToast();
              }
            })
          } else {
            this.props.navigation.navigate(info.item.url);
          }
        }}
      >
        <View style={styles.inner}>
          <View style={styles.left}>
            <Icon name={info.item.icon} size={24} color={info.item.color} style={styles.icon}/>
            <Text style={styles.text}>{info.item.name}</Text>
          </View>
          <Icon style={styles.rightIcon} name="ios-arrow-forward" size={21}/>
        </View>
      </TouchableOpacity>
    )
  };

  _sectionComp = (info) => {
    const key = info.section.key;
    return <Text style={styles.title}>{key === 'about' ? '支持我们' : '致谢'}</Text>;
  };

  _extraUniqueKey = (item, index) => {
    return "index" + index + item;
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.logoLayer}>
          <Image source={require('./Login/components/form/uestc.png')} resizeMode='contain' style={styles.logo}/>
        </View>
        <View style={styles.version}>
          <Text style={styles.versionText}>版本</Text>
          <Text style={styles.versionNumber}>1.0.0 (100)</Text>
        </View>
        <SectionList
          renderSectionHeader={this._sectionComp}
          renderItem={this._renderItem}
          keyExtractor = {this._extraUniqueKey}
          style={styles.sectionList}
          sections={
            [{
              key: 'about',
              data: [
                // {name: '在 App Store 评分', url: '', icon: 'ios-appstore', color: '#1f8af8', type: 'app-store'},
                {name: '关注本项目开源库', url: 'https://github.com/Vizards/uestc-react-native-ios', icon: 'ios-star', color: '#fdc600', type: '浏览器'},
                {name: '加入群聊讨论', url: 'mqqapi://card/show_pslcard?src_type=internal&version=1&uin=305337919&key=13fb709749e154e81ef0335ba145146cbc9b772f456853470075703f7d0dfb08&card_type=group&source=external', icon: 'ios-contacts', color: '#c5cfd4', type: 'QQ'},
                {name: '提出 BUG 或改进', url: 'mailto://vizards@front.dog', icon: 'ios-mail', color: '#51c733', type: '邮件'}
              ]
            }, {
              key: 'thanks',
              data: [
                {name: 'GitHub 开源软件', url: 'OpenSource', type: 'page', icon: 'logo-github', color: '#000000'},
                {name: '设计师 @轩轩', url: 'https://www.behance.net/XuanXuan1996', type: 'website', icon: 'ios-images', color: '#fdc600'},
                {name: '运营指导 @蛋总', url: 'https://www.ahulib.com/', type: 'website', icon: 'ios-build', color: '#1f8af8'}
              ]
            }]
          }
        />
      </ScrollView>
    )
  }
};

const $white = '#fff';
const $borderColor = 'rgb(200, 199, 204)';
const $text = 'rgb(3,3,3)';
const $titleColor = 'rgb(109, 109, 114)';
const $gray = 'rgb(143, 142, 148)';
const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  logoLayer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: 65,
    height: 65,
    marginTop: 25,
    marginBottom: 25,
    alignItems: 'center',
  },
  version: {
    backgroundColor: $white,
    width: '100%',
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  versionText: {
    fontSize: 17,
    color: $text,
  },
  versionNumber: {
    color: $gray,
    fontSize: 17,
  },
  sectionList: {
    width: '100%',
  },
  title: {
    paddingLeft: 15,
    paddingTop: 15,
    paddingBottom: 7,
    color: $titleColor
  },
  card: {
    backgroundColor: $white,
    paddingLeft: 15,
    height: 44,
    width: '100%',
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: $borderColor,
    height: 44,
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
    color: $text,
    paddingLeft: 10,
  },
  rightIcon: {
    paddingRight: 16,
    color: $gray,
  }
});
