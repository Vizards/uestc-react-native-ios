import React from 'react';
import {View, ScrollView, Text, StyleSheet, TouchableOpacity, SectionList, ActionSheetIOS, Dimensions, Switch, Alert, Linking} from 'react-native';
import { withNavigation } from "react-navigation";
import { inject, observer } from "mobx-react/native";

import RNCalendarEvents from 'react-native-calendar-events';
import BEMCheckBox from 'react-native-bem-check-box';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const SCREEN_HEIGHT = Dimensions.get('window').height;

@inject('rootStore')
@observer
class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courseData: [],
      isNull: false,
      needNotice: false,
      before: 0,
      minutes: '',
      noticeText: '开启推送通知',
      startDate: moment().format('YYYY-MM-DD'),
      buttonDisabled: false,
    };
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      headerTitle: '导入系统日历',
      headerRight: <Text style={styles.cancelButton} onPress={() => navigation.goBack()}>取消</Text>,
      headerLeft: params.isNull ? null : <TouchableOpacity><Text style={styles.selectButton} onPress={params.selectAll}>{params.select}</Text></TouchableOpacity>,
      headerStyle: {
        paddingRight: 15,
        paddingLeft: 15,
      }
    }
  };

  async requestPermission() {
    await Alert.alert(
      '授权请求',
      '\n写入日程需要授予日历权限',
      [
        {text: '取消', style: 'cancel'},
        {text: '确定', onPress: async () => {
          await Linking.openURL("App-Prefs:root=WIFI");
        }},
      ]
    )
  };

  async checkPermission() {
    const authStatus = await RNCalendarEvents.authorizationStatus();
    if (authStatus === 'undetermined') {
      const authResult = await RNCalendarEvents.authorizeEventStore();
      if (authResult !== 'authorized') await this.requestPermission();
    } else if (authStatus !== 'authorized') {
      await this.requestPermission();
    }
  }

  async checkMonday() {
    await Alert.alert(
      '开始日期错误',
      '\n您选择的日期不是星期一，请检查',
      [
        {text: '确定', style: 'cancel'},
      ]
    );
  }

  async writeEvents() {
    const courseData = await this.props.rootStore.StorageStore.constructor.load('course');
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
    let idArray = [];
    await this.props.rootStore.LoadingStore.loading(true, '导入中');
    // 这是一个 hack 方法，因为一次导入的数据量超过 4 就有可能导致闪退，所以数组分成 4 个一组，构建一个二维数组
    const allData = [];
    let currData = [];
    for (let i = 0; i < courseData.length; i++) {
      await currData.push(courseData[i]);
      if ((i !== 0 && (i + 1) % 4 === 0) || i === courseData.length - 1) {
        allData.push(currData);
        currData = [];
      }
    }
    // console.log(allData);
    await allData.forEach(async currData => {
      // 延迟写入，防止崩溃
      setTimeout(() => {
        currData.forEach(async item => {
          if (item.checked) {
            const title = `【上课提醒】${item.courseName}`;
            const location = `${item.room}(${item.teacher})`;
            const before = this.state.before;
            const startTime = item.time[0];
            const endTime = item.time[item.time.length - 1];
            // console.log('开始时间');
            // console.log('比星期一多几天', Number(startTime[0]));
            // console.log('时间：', timeArray[Number(startTime[1])][0]);
            // console.log('结束时间');
            // console.log('比星期一多几天：', Number(endTime[0]));
            // console.log('时间：', timeArray[Number(endTime[1])][1]);
            // console.log(this.state.startDate);
            const oddWeek = item.date[0].includes('单'); // 是否单周
            const evenWeek = item.date[0].includes('双'); // 是否双周
            let occurrence, startDate, endDate, interval;
            if (oddWeek) {
              const startWeek = Number(item.date[0].match(/(\S*)-/)[1]); // 开始周数
              const endWeek = Number(item.date[0].match(/-(\S*)单周/)[1]); // 结束周数
              occurrence = endWeek - startWeek + 1;
              interval = 2;
              startDate = moment(`${this.state.startDate} ${timeArray[Number(startTime[1])][0]}`, 'YYYY-MM-DD HH-mm').add(Number(startTime[0]) + (startWeek - 1) * 7, 'days').toISOString();
              endDate = moment(`${this.state.startDate} ${timeArray[Number(endTime[1])][1]}`, 'YYYY-MM-DD HH-mm').add(Number(endTime[0]) + (startWeek - 1) * 7, 'days').toISOString();
            } else if (evenWeek) {
              const startWeek = Number(item.date[0].match(/(\S*)-/)[1]); // 开始周数
              const endWeek = Number(item.date[0].match(/-(\S*)双周/)[1]); // 结束周数
              occurrence = endWeek - startWeek + 1;
              interval = 2;
              startDate = moment(`${this.state.startDate} ${timeArray[Number(startTime[1])][0]}`, 'YYYY-MM-DD HH-mm').add(Number(startTime[0]) + startWeek * 7, 'days').toISOString();
              endDate = moment(`${this.state.startDate} ${timeArray[Number(endTime[1])][1]}`, 'YYYY-MM-DD HH-mm').add(Number(endTime[0]) + endWeek * 7, 'days').toISOString();
            } else {
              const startWeek = Number(item.date[0].match(/(\S*)-/)[1]); // 开始周数
              const endWeek = Number(item.date[0].match(/-(\S*)周/)[1]); // 结束周数
              occurrence = endWeek - startWeek + 1;
              interval = 1;
              startDate = moment(`${this.state.startDate} ${timeArray[Number(startTime[1])][0]}`, 'YYYY-MM-DD HH-mm').add(Number(startTime[0]) + + (startWeek - 1) * 7, 'days').toISOString();
              endDate = moment(`${this.state.startDate} ${timeArray[Number(endTime[1])][1]}`, 'YYYY-MM-DD HH-mm').add(Number(endTime[0]) + + (startWeek - 1) * 7, 'days').toISOString();
            }

            // console.log({
            //   title,
            //   location,
            //   notes: '由应用UESTC创建',
            //   needNotice: this.state.needNotice,
            //   before,
            //   occurrence,
            //   interval,
            //   startDate,
            //   endDate,
            // }); // 周数也即提醒次数

            /** RNCalendarEvents 的 bug，无法一次性写入所有配置
             * 只能在回调里更新其他配置
             * 还特么不能用 promise... 只能回调地狱
             */
            try {
              RNCalendarEvents.saveEvent(title, {
                startDate,
                endDate,
                notes: '由应用UESTC创建'
              }, {
                futureEvents: true,
              }).then(id => {
                RNCalendarEvents.saveEvent(title, {
                  id,
                  recurrenceRule: {
                    frequency: 'weekly',
                    occurrence,
                    interval,
                  },
                }, {
                  futureEvents: true,
                }).then(id => {
                  RNCalendarEvents.saveEvent(title, {
                    id,
                    location,
                  }, {
                    futureEvents: true,
                  }).then(id => {
                    RNCalendarEvents.saveEvent(title, {
                      id,
                      alarms: this.state.needNotice ? [{
                        date: before,
                      }] : []
                    }, {
                      futureEvents: true,
                    }).then((id) => {
                      idArray.push(id);
                      // console.log(idArray.length);
                      // console.log(courseData.filter(item => item.checked));
                      if (idArray.length === courseData.filter(item => item.checked).length) {
                        this.props.rootStore.LoadingStore.loading(false);
                        this.props.rootStore.UserStore.toast('success', `🎉 成功导入${idArray.length}节课程！可在系统日历中查看`);
                        this.props.rootStore.UserStore.clearToast();
                      }
                    });
                  })
                });
              });
            } catch (err) {
              await this.props.rootStore.UserStore.toast('error', '💊 导入过程出现错误，请稍后重试');
            }
          }
        });
      }, 1000)
    });
  }

  async removeExist() {
    const startDate = moment(`${this.state.startDate}`, 'YYYY-MM-DD').toISOString();
    const endDate = moment(`${this.state.startDate}`, 'YYYY-MM-DD').add(6, 'months').toISOString();
    const allEvents = await RNCalendarEvents.fetchAllEvents(startDate, endDate);
    await allEvents.forEach(async item => {
      if (item.notes === '由应用UESTC创建') {
        await RNCalendarEvents.removeEvent(item.id, {
          futureEvents: true
        });
      }
    });
  };

  async importCalendar() {
    // 检查权限
    await this.checkPermission();
    // 检查输入日期是否为星期一
    // http://momentjs.cn/docs/#/get-set/weekday/
    if (moment(this.state.startDate).weekday() === 0) {
      // 删除日历中已经存在的重复课程
      await this.removeExist();
      await this.writeEvents();
    } else {
      await this.checkMonday();
    }
  }

  async _selectAll() {
    let courseData = this.state.courseData[0].data;

    if (this.props.navigation.state.params.select === '全选') {
      courseData = courseData.map(item => {
        item.checked = true;
        return item;
      });
      this.setState({ buttonDisabled: false });
      this.props.navigation.setParams({ select: '全不选' });
    }
    if (this.props.navigation.state.params.select === '全不选') {
      courseData = courseData.map(item => {
        item.checked = false;
        return item;
      });
      this.setState({ buttonDisabled: true });
      this.props.navigation.setParams({ select: '全选' });
    }
    await this.setState({
      courseData: [{ key: 0, data: courseData }],
    });
    await this.sectionListRef.forceUpdate();
  }

  async _showMenuActionSheet() {
    const BUTTONS = ['上课时提醒', '提前 5 分钟', '提前 15 分钟', '提前 30 分钟', '提前 1 小时', '取消'];
    const CANCEL_INDEX = BUTTONS.length - 1;
    ActionSheetIOS.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: CANCEL_INDEX,
      title: '选择提前提醒时间'
    }, async (buttonIndex) => {
      if (buttonIndex === 0) await this.setState({ noticeText: '上课时提醒', before: 0 });
      if (buttonIndex === 1) await this.setState({ noticeText: '上课前 5 分钟提醒', before: -5 });
      if (buttonIndex === 2) await this.setState({ noticeText: '上课前 15 分钟提醒', before: -15 });
      if (buttonIndex === 3) await this.setState({ noticeText: '上课前 30 分钟提醒', before: -30 });
      if (buttonIndex === 4) await this.setState({ noticeText: '上课前 1 小时提醒', before: -60 });
      if (buttonIndex !== BUTTONS.length - 1) await this.setState({ needNotice: !this.state.needNotice });
    });
  }

  async readCourseStorage() {
    let courseData = await this.props.rootStore.StorageStore.constructor.load('course');
    courseData = await this.constructor.parseCourseData(courseData);
    await this.setState({
      courseData,
      isNull: courseData[0].data.length === 0,
      buttonDisabled: courseData[0].data.length === 0,
    })
  }

  static async parseCourseData(courseData) {
    courseData = courseData.map((item) => Object.assign(item, {checked: true}));
    return [{ key: 0, data: courseData }];
  }

  _renderItem = (info) => {
    return (
      <View style={[styles.options, info.index === 0 && styles.firstCard, info.index === info.section.data.length - 1 && styles.lastCard]}>
        <TouchableOpacity style={[styles.option, info.index === info.section.data.length - 1 && styles.lastInnerCard]} onPress={async () => {
          let courseData = this.state.courseData;
          courseData[0].data[info.index].checked = !courseData[0].data[info.index].checked;
          await this.sectionListRef.forceUpdate();
          if (!courseData[0].data.map(item => item.checked).reduce((before, after) => before || after)) {
            this.setState({ buttonDisabled: true });
          } else {
            this.setState({ buttonDisabled: false });
          }
        }}>
          <BEMCheckBox
            onAnimationType={'bounce'}
            offAnimationType={'bounce'}
            onFillColor={$buttonBackgroundColor}
            onTintColor={$buttonBackgroundColor}
            onCheckColor={'#fff'}
            style={styles.checkbox}
            lineWidth={1}
            value={info.item.checked}
            pointerEvents={'none'}
          />
          <Text style={styles.optionText}>{info.item.courseName.length < 13 ? info.item.courseName : `${info.item.courseName.substr(0, 12)}...`}</Text>
        </TouchableOpacity>
      </View>
    )
  };

  _sectionComp = (info) => {
    if (info.section.data.length !== 0) return <Text style={styles.title}>可导入课程</Text>;
  };

  _extraUniqueKey = (item ,index) => {
    return "index" + index + item;
  };

  async componentWillMount() {
    await this.readCourseStorage();
    await this.props.navigation.setParams({
      select: '全不选',
      selectAll: this._selectAll.bind(this),
      isNull: this.state.isNull,
    });
  }

  async clearCalendar() {
    await this.checkPermission();
    await Alert.alert(
      '提醒',
      '\n将会删除系统日历中近2年的课程安排，是否继续？',
      [
        {text: '取消', style: 'cancel'},
        {text: '继续', style: 'warning', onPress: async () => {
            // 时间跨度超过 2 年，就不能获取到了...
            const startDate = moment().subtract(1, 'years').toISOString();
            const endDate = moment().add(1, 'years').toISOString();
            const allEvents = await RNCalendarEvents.fetchAllEvents(startDate, endDate);
            await allEvents.forEach(async item => {
              if (item.notes === '由应用UESTC创建') {
                await RNCalendarEvents.removeEvent(item.id, {
                  futureEvents: true
                });
              }
            });
            await this.props.rootStore.UserStore.toast('success', '🎉 已从系统日历中删除所有课程');
            await this.props.rootStore.UserStore.clearToast();
          }
        }
      ]
    );
  }

  render() {
    return (
      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionHeader}>日历通知设置</Text>
        <View style={styles.switchOptions}>
          <TouchableOpacity style={styles.switchOption} onPress={async () => {
            if (!this.state.needNotice) {
              await this._showMenuActionSheet();
            } else {
              await this.setState({
                needNotice: false,
                noticeText: '开启推送通知'
              });
            }
          }}>
            <Text style={styles.switchOptionText}>{this.state.noticeText}</Text>
            <Switch
              value={this.state.needNotice}
              onTintColor={$buttonBackgroundColor}
              pointerEvents={'none'}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.tipText}>推荐添加“日历”到通知中心小组件</Text>
        <Text style={styles.sectionHeader}>设置学期开始日期(第一周周一)</Text>
        <DatePicker
          style={styles.datePicker}
          date={this.state.startDate}
          mode="date"
          placeholder={moment().format('YYYY-MM-DD')}
          format="YYYY-MM-DD"
          showIcon={false}
          customStyles={{
            dateInput: {
              borderWidth: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              marginLeft: 0,
              paddingLeft: 15,
              borderTopWidth: 0.5,
              borderTopColor: $borderColor,
              borderBottomWidth: 0.5,
              borderBottomColor: $borderColor,
              height: 44,
              width: '100%',
              backgroundColor: '#fff',
            },
            placeholderText: {
              color: '#000',
              fontSize: 17,
            },
            dateText: {
              color: '#000',
              fontSize: 17,
            },
          }}
          onDateChange={(date) => {this.setState({ startDate: date })}}
        />
        <View style={styles.sectionFooter}>
          <Text style={styles.sectionFooterText}>起始日期设置错误将导致日程混乱</Text>
          <TouchableOpacity onPress={this.clearCalendar.bind(this)}>
            <Text style={styles.clearText}>清理系统日程</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={[styles.Button, this.state.buttonDisabled && styles.buttonDisabled]}
            onPress={this.importCalendar.bind(this)}
            disabled={this.state.buttonDisabled}
          >
            <Text style={styles.buttonText}>开始导入</Text>
          </TouchableOpacity>
        </View>
        {this.state.isNull ? <View style={styles.noData}>
          <Text style={styles.noText}>没有可导入的课程&nbsp;🙈</Text>
        </View> : <SectionList
          renderSectionHeader={this._sectionComp}
          renderItem={this._renderItem}
          keyExtractor = {this._extraUniqueKey}
          sections={this.state.courseData}
          style={styles.sectionList}
          ref={(ref) => { this.sectionListRef = ref; }}
        />}
      </ScrollView>
    )
  }
}

export default withNavigation(Calendar);

const $frontColor = '#fff';
const $titleColor = 'rgb(109, 109, 114)';
const $borderColor = 'rgb(200, 199, 204)';
const $gray = 'rgb(143, 142, 148)';
const $buttonBackgroundColor = 'rgb(96, 165, 246)';
const $buttonDisabledBackgroundColor = 'rgba(96, 165, 246, 0.5)';
const $textInputBackgroundColor = '#fff';
const styles = StyleSheet.create({
  scrollView: {
    height: '100%',
    paddingTop: 20,
  },
  noData: {
    width: '100%',
    marginTop: (SCREEN_HEIGHT - 100 - 26.5 - 44 - 30 - 38 - 44 - 27.5 - 20 - 43.5) / 2 - 56,
    flexDirection: 'column',
    alignItems: 'center'
  },
  noText: {
    color: $gray,
    fontSize: 15,
    paddingBottom: 5,
    paddingTop: 5,
  },
  tipText: {
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
    color: $titleColor,
  },
  title: {
    paddingLeft: 15,
    paddingTop: 6,
    paddingBottom: 7,
    color: $titleColor
  },
  cancelButton: {
    fontSize: 16
  },
  selectButton: {
    fontSize: 16,
    color: $buttonBackgroundColor
  },
  checkbox: {
    height: 21,
    width: 21,
  },
  sectionHeader: {
    paddingLeft: 15,
    paddingTop: 6,
    paddingBottom: 7,
    color: $titleColor
  },
  sectionFooter: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
    paddingBottom: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionFooterText: {
    color: $titleColor
  },
  clearText: {
    color: $buttonBackgroundColor
  },
  switchOptions: {
    borderTopWidth: 0.5,
    borderTopColor: $borderColor,
    borderBottomWidth: 0.5,
    borderBottomColor: $borderColor,
    backgroundColor: $frontColor,
  },
  switchOption: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    paddingLeft: 15,
    paddingRight: 15
  },
  switchOptionText: {
    fontSize: 17,
  },
  options: {
    paddingLeft: 15,
    backgroundColor: $frontColor,
  },
  firstCard: {
    borderTopWidth: 0.5,
    borderTopColor: $borderColor,
  },
  lastCard: {
    borderBottomWidth: 0.5,
    borderBottomColor: $borderColor,
  },
  option: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 44,
    borderBottomWidth: 0.5,
    borderBottomColor: $borderColor,
  },
  lastInnerCard: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 17,
    paddingLeft: 12,
  },
  datePicker: {
    width: '100%'
  },
  Button: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: $buttonBackgroundColor,
    borderRadius: 8,
  },
  buttonWrapper: {
    paddingTop: 25,
    paddingLeft: 17,
    paddingRight: 17,
    paddingBottom: 25,
  },
  buttonText: {
    color: $textInputBackgroundColor,
    fontSize: 15,
  },
  buttonDisabled: {
    backgroundColor: $buttonDisabledBackgroundColor,
  },
  sectionList: {
    paddingBottom: 50
  },
});
