import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Text,
  View,
  SectionList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActionSheetIOS,
  Dimensions
} from 'react-native';
import { inject, observer } from "mobx-react/native";
import moment from 'moment';
import 'moment/locale/zh-cn';

import semester from '../../../common/helpers/semester';
const current = require('../../../common/helpers/current');
const SCREEN_HEIGHT = Dimensions.get('window').height;

moment.locale('zh-cn');

@inject('rootStore')
@observer
export default class Arrangement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      examData: [],
      year: '',
      isNull: false,
      semester: '',
      selectedText: '',
      refreshing: false,
    }
  }

  _renderItem = (info) => {
    const address = info.item.address === '[考试情况尚未发布]' ? '' : info.item.address,
      date = info.item.date,
      time = /[012][0-9]:[0-5][[0-9]-[012][0-9]:[0-5][0-9]/.exec(info.item.detail)[0],
      name = info.item.name.length < 13 ? info.item.name : `${info.item.name.substr(0, 12)}...`,
      seat = info.item.seat,
      status = info.item.status;
    const examStartTime = moment(`${date} ${time.substr(0, 5)}`);
    const examEndTime = moment(`${date} ${time.substr(6, 11)}`);
    const isEnded = examEndTime.isBefore(moment());
    const isStarted = examStartTime.isBefore(moment());
    const jetLag = examStartTime.fromNow();
    return (
      <View style={[styles.card, info.index === 0 && styles.firstCard, info.index === info.section.data.length - 1 && styles.lastCard]}>
        <View style={[styles.inner, info.index === info.section.data.length - 1 && styles.lastInnerCard]}>
          <View style={styles.exam}>
            <Text style={[styles.name, isEnded && styles.outdated]}>{name}</Text>
            <View>
              <Text style={[styles.date, isEnded && styles.outdated]}>{date}</Text>
            </View>
          </View>
          <View style={styles.status}>
            <Text style={styles.info}>{time} {address} {seat} {status}</Text>
            {isEnded ? <Text style={styles.finished}>已结束</Text> : isEnded === false && isStarted === true ? <Text style={styles.remain}>正在进行</Text> : <Text style={styles.remain}>{`还有 ${jetLag.substr(0, jetLag.length - 1)}`}</Text>}
          </View>
        </View>
      </View>
    )
  };

  _sectionComp = (info) => {
    const key = info.section.key;
    if (key === 0 && info.section.data.length !== 0) return <Text style={styles.title}>期末考试</Text>;
    if (key === 1 && info.section.data.length !== 0) return <Text style={styles.title}>期中考试</Text>;
    if (key === 2 && info.section.data.length !== 0) return <Text style={styles.title}>补考</Text>;
    if (key === 3 && info.section.data.length !== 0) return <Text style={styles.title}>缓考</Text>;
  };

  _extraUniqueKey = (item, index) => {
    return "index"+index+item;
  };

  async loadUserData() {
    return await this.props.rootStore.StorageStore.constructor.load('user');
  };

  static async parseExamData(examData) {
    return examData.map((exam, index) => {
      return { key: index, data: exam };
    });
  }

  async saveExamData(data) {
    await this.props.rootStore.StorageStore.save('exam', data);
  }

  async updateExamData(year, semester, token) {
    await this.props.rootStore.LoadingStore.loading(true, '同步中...');
    const response = await this.props.rootStore.UserStore.exam(String(year), String(semester), token);
    await this.props.rootStore.LoadingStore.loading(false);
    if (response.code === 201) {
      const parsedExamData = await this.constructor.parseExamData(response.data);
      await this.saveExamData({ parsedExamData, year, semester });
      await this.setState({
        examData: parsedExamData,
        isNull: parsedExamData[0].data.length === 0 && parsedExamData[1].data.length === 0 && parsedExamData[2].data.length === 0 && parsedExamData[3].data.length === 0,
        year,
        semester,
        selectedText: `${year} 学年第 ${semester} 学期`,
      });
      return { year, semester, parsedExamData };
    } else {
      await this.props.rootStore.UserStore.toast('error', '💊 暂时无法获取考试安排信息，请稍后重试');
      await this.props.rootStore.UserStore.clearToast();
      return false;
    }
  }

  async _showActionSheet() {
    const lastLoginData = await this.props.rootStore.StorageStore.constructor.load('user');
    const BUTTONS = await semester(lastLoginData.username).map(item => {
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
          const userData = await this.loadUserData();
          const response = await this.updateExamData(BUTTONS[buttonIndex].substr(0, 4), BUTTONS[buttonIndex].substr(9, 1), userData.token);
          if (response) await this.setState({
            selectedText: BUTTONS[buttonIndex],
          });
        }
      });
  };

  async componentWillMount() {
    try {
      const examData = await this.props.rootStore.StorageStore.constructor.load('exam');
      this.setState({
        examData: examData.parsedExamData,
        isNull: examData.parsedExamData[0].data.length === 0 && examData.parsedExamData[1].data.length === 0 && examData.parsedExamData[2].data.length === 0 && examData.parsedExamData[3].data.length === 0,
        year: examData.year,
        semester: examData.semester,
        selectedText: `${examData.year} 学年第 ${examData.semester} 学期`
      });
    } catch (err) {
      const userData = await this.loadUserData();
      await this.updateExamData(current.year, current.semester, userData.token);
    }
  }

  async refresh() {
    await this.setState({ refreshing: true });
    const userData = await this.loadUserData();
    await this.updateExamData(this.state.year, this.state.semester, userData.token);
    await this.setState({ refreshing: false });
  }

  render() {
    return (
      <ScrollView style={styles.scrollView}>
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this.refresh.bind(this)}
        />
        <TouchableOpacity
          onPress={this._showActionSheet.bind(this)}
          style={styles.selector}
        >
          <Text style={styles.left}>学年学期</Text>
          <View style={styles.right}>
            <Text style={styles.rightText}>{this.state.selectedText}</Text>
            <Icon style={styles.rightIcon} name="ios-arrow-forward" size={21}/>
          </View>
        </TouchableOpacity>
        {this.state.isNull ? <View style={styles.noData}>
          <Text style={styles.noText}>本学期还没有安排考试&nbsp;🐶</Text>
          <Text style={styles.noText}>试试下拉刷新 or 戳上面切换学期&nbsp;👆</Text>
        </View> : <SectionList
          renderSectionHeader={this._sectionComp}
          renderItem={this._renderItem}
          keyExtractor = {this._extraUniqueKey}
          style={styles.sectionList}
          sections={this.state.examData}
        />}
      </ScrollView>
    );
  }
}

const $frontColor = '#fff';
const $gray = 'rgb(143, 142, 148)';
const $titleColor = 'rgb(109, 109, 114)';
const $borderColor = 'rgb(200, 199, 204)';
const $title = 'rgb(3,3,3)';
const $info = 'rgba(3,3,3,0.3)';
const $dateColor = 'rgb(74, 217, 100)';
const styles = StyleSheet.create({
  noData: {
    width: '100%',
    marginTop: (SCREEN_HEIGHT - 84.5 - 44 - 48.5) / 2 - 56,
    flexDirection: 'column',
    alignItems: 'center'
  },
  noText: {
    color: $gray,
    fontSize: 15,
    paddingBottom: 5,
    paddingTop: 5,
  },
  scrollView: {
    height: '100%'
  },
  selector: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: $frontColor,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: $borderColor,
  },
  left: {
    fontSize: 17,
  },
  right: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightText: {
    fontSize: 17,
    color: $gray,
    paddingRight: 11,
  },
  rightIcon: {
    paddingTop: 2,
    color: $gray,
  },
  title: {
    paddingLeft: 15,
    paddingTop: 6,
    paddingBottom: 7,
    color: $titleColor
  },
  card: {
    backgroundColor: $frontColor,
    paddingLeft: 15,
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
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: $borderColor,
    paddingTop: 13,
    paddingBottom: 14,
  },
  lastInnerCard: {
    borderBottomWidth: 0,
  },
  exam: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15,
    paddingBottom: 9,
  },
  status: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15,
  },
  name: {
    color: $title,
    fontSize: 17,
  },
  info: {
    color: $info,
    fontSize: 13,
  },
  date: {
    color: $dateColor,
    fontSize: 17,
  },
  outdated: {
    color: $info,
  },
  finished: {
    textAlign: 'right',
    fontSize: 13,
    color: $info,
  },
  remain: {
    textAlign: 'right',
    fontSize: 13,
    color: $dateColor,
  },
  sectionList: {
    paddingBottom: 20
  },
});
