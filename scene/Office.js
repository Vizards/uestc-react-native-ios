import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SafariView from 'react-native-safari-view';

import config from '../config';

export default class Office extends React.Component {
  static navigationOptions = ({ navigation }) =>  {
    const { params } = navigation.state;
    return {
      title: params.type === 'announcement' ? '教务信息公告' : '快捷查询',
    }
  };

  render() {
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          {params.type === 'announcement' ? <MaterialIcon name={'announcement'} size={48} color={'#fdc600'}/> : <MaterialCommunityIcon name={'search-web'} color={'#239ff4'} size={48}/>}
        </View>
        <View style={styles.list}>
          <TouchableOpacity style={styles.item} onPress={() => SafariView.show({
            url: params.type === 'announcement' ? `${config.domain}/api/extra/stu` : `${config.domain}/api/extra/room`
          })}>
            <Text style={styles.text}>{params.type === 'announcement' ? '教学管理公告' : '空闲教室查询'}</Text>
            <Icon style={styles.icon} name="ios-arrow-forward" size={21}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => SafariView.show({
            url: params.type === 'announcement' ? `${config.domain}/api/extra/edu` : `${config.domain}/api/extra/today-course`
          })}>
            <Text style={styles.text}>{params.type === 'announcement' ? '教研教改公告' : '当日课程查询'}</Text>
            <Icon style={styles.icon} name="ios-arrow-forward" size={21}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => SafariView.show({
            url: params.type === 'announcement' ? `${config.domain}/api/extra/communication` : `${config.domain}/api/extra/search-course`
          })}>
            <Text style={styles.text}>{params.type === 'announcement' ? '实践交流公告' : '全校课程查询' }</Text>
            <Icon style={styles.icon} name="ios-arrow-forward" size={21}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => SafariView.show({
            url: params.type === 'announcement' ? `${config.domain}/api/extra/news` : `${config.domain}/api/extra/search-teacher`
          })}>
            <Text style={styles.text}>{params.type === 'announcement' ? '教学新闻' : '教师信息查询'}</Text>
            <Icon style={styles.icon} name="ios-arrow-forward" size={21}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const $gray = 'rgb(143, 142, 148)';
const $back = 'rgb(239, 239, 244)';
const $white = '#fff';
const $borderColor = 'rgb(200, 199, 204)';
const styles = StyleSheet.create({
  container: {
    backgroundColor: $back,
  },
  logo: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  list: {
    backgroundColor: $white,
    paddingLeft: 15,
  },
  item: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: $borderColor,
  },
  text: {
    fontSize: 17,
  },
  icon: {
    paddingTop: 2,
    color: $gray,
  },
});
