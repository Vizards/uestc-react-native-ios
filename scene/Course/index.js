import React from 'react';
/* eslint-disable */
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActionSheetIOS } from 'react-native';
/* eslint-enable */
import { Ionicons } from '@expo/vector-icons';
import { withNavigation } from 'react-navigation';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import { inject, observer } from "mobx-react/native";
import handleParseData from '../../common/helpers/parser';
import moment from "moment";

const current = require('../../common/helpers/current');
const semester = require('../../common/helpers/semester');

@inject('rootStore')
@observer
class Course extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      parsedCourseData: [],
      clicked: '',
    }
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      headerTitle: params.title ? params.title : '课程表',
      headerRight: <TouchableOpacity
        onPress={params.showActionSheet}
      >
        <Ionicons name='ios-sync-outline' size={25}/>
      </TouchableOpacity>,
      headerStyle: {
        paddingRight: 15,
        paddingLeft: 15,
        borderBottomColor: 'transparent',
      },
    }
  };

  async _showActionSheet() {
    const BUTTONS = await semester.map(item => {
      return `${item.year} 学年第 ${item.semester} 学期`
    });
    await BUTTONS.push('取消');
    const CANCEL_INDEX = await BUTTONS.length - 1;
    ActionSheetIOS.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: '选择学期',
      },
      async (buttonIndex) => {
        if (buttonIndex !== CANCEL_INDEX) {
          const response = await this.updateCourseData(BUTTONS[buttonIndex].substr(0, 4), BUTTONS[buttonIndex].substr(9, 1));
          if (response) await this.props.navigation.setParams({ title: BUTTONS[buttonIndex] });
        }
      });
  };

  async loadUserData() {
    return await this.props.rootStore.StorageStore.constructor.load('user');
  };

  async getCourseData(year, semester, token) {
    await this.props.rootStore.LoadingStore.loading(true, '同步课表...');
    const response = await this.props.rootStore.UserStore.course(String(year), String(semester), token);
    if (response.code === 201) {
      await this.props.rootStore.StorageStore.save('course', response.data);
      await this.props.rootStore.LoadingStore.loading(false);
      return response.data;
    } else {
      try {
        const lastLoginData = await this.props.rootStore.StorageStore.constructor.load('user');
        const token = await this.refreshToken(lastLoginData);
        await this.getCourseData(year, semester, token);
      } catch (err) {
        await this.props.rootStore.LoadingStore.loading(false);
        await this.props.rootStore.UserStore.toast('error', '暂时无法从教务系统同步课表，请稍后重试');
        await this.props.rootStore.UserStore.clearToast();
      }
    }
  }

  async updateCourseData(year, semester) {
    try {
      const userData = await this.loadUserData();
      const courseData = await this.getCourseData(year, semester, userData.token);
      await this.handleRenderData(courseData);
      return courseData !== undefined;
    } catch (err) {
      await this.handleRedirectLogin();
      return false;
    }
  }

  async handleRenderData(data) {
    const courseData = data !== undefined ? data : await this.props.rootStore.StorageStore.constructor.load('course');
    const parsedCourseData = await handleParseData(courseData);
    this.setState({
      parsedCourseData,
    });
  }

  async handleRedirectLogin() {
    await this.props.rootStore.LoadingStore.loading(false);
    await this.props.rootStore.UserStore.toast('info', '请先登录');
    await this.props.navigation.navigate('Login');
    await this.props.rootStore.UserStore.clearToast();
  }

  async refreshToken(lastLoginData) {
    await this.props.rootStore.LoadingStore.loading(true, '自动登录中');
    const responseJson = await this.props.rootStore.UserStore.login(lastLoginData.username, lastLoginData.password);
    await this.props.rootStore.StorageStore.save('user', {
      username: lastLoginData.username,
      password: lastLoginData.password,
      token: responseJson.data.token,
      time: responseJson.time,
    });
    await this.props.rootStore.LoadingStore.loading(false);
    return responseJson.data.token;
  }

  async componentWillMount() {
    // 检测距上次登录时间是否超过 7 天，超过则自动更新 token
    try {
      const lastLoginData = await this.props.rootStore.StorageStore.constructor.load('user');
      if (moment().diff(lastLoginData.time) >= 604800000) {
        await this.refreshToken(lastLoginData);
      }
      try {
        await this.handleRenderData();
      } catch (err) {
        await this.updateCourseData(current.year, current.semester);
      }
      await this.props.navigation.setParams({ showActionSheet: this._showActionSheet.bind(this) });
    } catch (err) {
      await this.handleRedirectLogin();
    }
  }

  render() {
    const tableHead = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const timeArray =  [
      ['8:30', '9:15'],
      ['9:20', '10:05'],
      ['10:20', '11:05'],
      ['11:10', '11:55'],
      ['14:30', '15:15'],
      ['15:20', '16:05'],
      ['16:20', '17:05'],
      ['17:10', '17:55'],
      ['19:30', '20:15'],
      ['20:20', '21:05'],
      ['21:10', '21:55'],
      ['22:00', '22:45']
    ];
    const tableTitle = timeArray.map((ele, index) => {
      return (
        <View style={styles.timeGrid}>
          <Text style={styles.timeText}>{ele[0]}</Text>
          <Text style={styles.timeText}>第{index + 1}节</Text>
          <Text style={styles.timeText}>{ele[1]}</Text>
        </View>
      )
    });
    const widthArr = [82, 82, 82, 82, 82, 82, 82];
    return (
      <ScrollView>
        {/*eslint-disable*/}
        <Table style={styles.table} borderStyle={{ borderWidth: 0 }}>
          {/* Left Wrapper */}
          <TableWrapper borderStyle={{ borderWidth: 0 }}>
            {/*eslint-enable*/}
            <Cell data=" " height={40} style={styles.head} textStyle={styles.headText}/>
            {
              tableTitle.map((title, i) => (
                <Cell key={i} data={title} height={80} style={styles.time} textStyle={styles.titleText}/>
              ))
            }
          </TableWrapper>


          {/* Right scrollview Wrapper */}
          <ScrollView horizontal={true}>
            {/* If parent element is not table element, you should add the type of borderstyle. */}
            {/*eslint-disable*/}
            <TableWrapper borderStyle={{ borderWidth: 0 }}>
              {/*eslint-enable*/}
              <Row data={tableHead} style={styles.head} textStyle={styles.headText} widthArr={widthArr}/>
              {
                this.state.parsedCourseData.map((data, i) => (
                  <Row key={i} data={data} style={styles.list} widthArr={widthArr} textStyle={styles.listText}/>
                ))
              }
            </TableWrapper>
          </ScrollView>
        </Table>
      </ScrollView>
    );
  }
}

export default withNavigation(Course);

const $white = '#ebebf1';
const $black = '#000';
const $backgroundColor = '#f7f7f7';
const $headBorderColor = '#a7a7aa';
const styles = StyleSheet.create({
  table: {
    flexDirection: 'row',
    borderWidth: 0
  },
  time: {
    borderColor: $white,
    borderLeftWidth: 0,
    backgroundColor: $backgroundColor,
  },
  timeText: {
    textAlign: 'center',
    fontSize: 12,
    paddingBottom: 5
  },
  timeGrid: {
    paddingLeft: 5,
    paddingRight: 5
  },
  head: {
    backgroundColor: $backgroundColor,
    height: 40,
    borderBottomWidth: 0.5,
    borderBottomColor: $headBorderColor,
  },
  headText: {
    color: $black,
    textAlign: 'center'
  },
  titleText: {
    marginLeft: 6
  },
  list: {
    height: 80,
    backgroundColor: $white,
    borderWidth: 0,
  },
  listText: {
    fontSize: 12,
    padding: 5,
  }
});

