import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SectionList, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class OpenSource extends React.Component {
  static navigationOptions = {
    title: '致谢',
  };

  _renderItem = (info) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => Linking.canOpenURL(info.item.url).then(supported => {
          if (supported) Linking.openURL(info.item.url);
          if (!supported) {
            this.props.rootStore.UserStore.toast('warning', `⚠️ 请先安装浏览器`);
            this.props.rootStore.UserStore.clearToast();
          }
        })}
      >
        <View style={styles.inner}>
          <View style={styles.left}>
            <Text style={styles.text}>{info.item.name}</Text>
          </View>
          <Icon style={styles.rightIcon} name="ios-arrow-forward" size={21}/>
        </View>
      </TouchableOpacity>
    )
  };

  _sectionComp = () => {
    return <Text style={styles.title}>感谢下列项目的付出</Text>;
  };

  _extraUniqueKey = (item, index) => {
    return "index" + index + item;
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <SectionList
          renderSectionHeader={this._sectionComp}
          renderItem={this._renderItem}
          keyExtractor = {this._extraUniqueKey}
          style={styles.sectionList}
          sections={
            [{
              key: 'thanks',
              data: [
                {name: 'create-react-native-app', url: 'https://github.com/react-community/create-react-native-app'},
                {name: 'react-native-linear-gradient', url: 'https://github.com/react-native-community/react-native-linear-gradient'},
                {name: 'react-native-wkwebview', url: 'https://github.com/CRAlpha/react-native-wkwebview'},
                {name: 'react-native-bem-check-box', url: 'https://github.com/torifat/react-native-bem-check-box'},
                {name: 'react-native-calendar-events', url: 'https://github.com/wmcmahan/react-native-calendar-events'},
                {name: 'react-native-datepicker', url: 'https://github.com/xgfe/react-native-datepicker'},
                {name: 'react-native-shimmer-placeholder', url: 'https://github.com/tomzaku/react-native-shimmer-placeholder'},
                {name: 'react-native-storage', url: 'https://github.com/sunnylqm/react-native-storage'},
                {name: 'react-native-table-component', url: 'https://github.com/Gil2015/react-native-table-component'},
                {name: 'react-native-toaster', url: 'https://github.com/tableflip/react-native-toaster'},
                {name: 'react-native-vector-icons', url: 'https://github.com/oblador/react-native-vector-icons'},
                {name: 'react-native-launch-image', url: 'https://github.com/reactnativecn/react-native-launch-image'},
                {name: 'react-native-web-echarts', url: 'https://github.com/womkim/react-native-web-echarts'},
                {name: 'react-navigation', url: 'https://github.com/react-navigation/react-navigation'},
                {name: 'bugsnag-react-native', url: 'https://github.com/bugsnag/bugsnag-react-native'},
                {name: 'underscore', url: 'https://github.com/jashkenas/underscore'},
                {name: 'moment', url: 'https://github.com/moment/moment'},
                {name: 'mobx', url: 'https://github.com/mobxjs/mobx'},
              ]
            }]
          }
        />
      </ScrollView>
    )
  }
}

const $white = '#fff';
const $borderColor = 'rgb(200, 199, 204)';
const $text = 'rgb(3,3,3)';
const $titleColor = 'rgb(109, 109, 114)';
const $gray = 'rgb(143, 142, 148)';
const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  sectionList: {
    width: '100%',
  },
  title: {
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 15,
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