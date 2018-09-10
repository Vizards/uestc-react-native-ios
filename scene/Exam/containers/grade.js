import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text, View, SectionList, RefreshControl, ScrollView, TouchableOpacity, StyleSheet, ActionSheetIOS, Dimensions } from 'react-native';
import { inject, observer } from "mobx-react/native";

import semester from '../../../common/helpers/semester';
const current = require('../../../common/helpers/current');
const SCREEN_HEIGHT = Dimensions.get('window').height;

@inject('rootStore')
@observer
export default class Grade extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gradeData: [],
      isNull: false,
      year: '',
      semester: '',
      selectedText: '',
      refreshing: false,
    }
  }

  _renderItem = (info) => {
    const type = info.item.type,
      final = isNaN(Number(info.item.final)) ? info.item.final : Number(info.item.final),
      credit = info.item.credit,
      overall = info.item.overall,
      name = info.item.name.length < 13 ? info.item.name : `${info.item.name.substr(0, 12)}...`,
      resit = info.item.resit,
      gpa = info.item.gpa;
    return (
      info.section.data[0].name !== '' ? <View style={[styles.card, info.index === 0 && styles.firstCard, info.index === info.section.data.length - 1 && styles.lastCard]}>
        <View style={[styles.inner, info.index === info.section.data.length - 1 && styles.lastInnerCard]}>
          <View style={styles.exam}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.info}>
              <Text style={styles.infoTop}>{type}</Text>
              <View style={styles.infoMiddle}>
                <Text style={styles.infoText}>学分：{credit}</Text>
                <Text style={styles.infoLast}>总评成绩：{overall}</Text>
              </View>
              <View style={styles.infoBottom}>
                <Text style={styles.infoText}>补考总评：{resit}</Text>
                <Text style={styles.infoText}>绩点：{gpa}</Text>
              </View>
            </View>
          </View>
          <View style={styles.status}>
            <Text style={[styles.date, (final < 60 || final === 'D') && styles.flunk]}>{final}</Text>
            <Text style={styles.final}>最终</Text>
          </View>
        </View>
      </View> : null
    )
  };

  _sectionComp = (info) => {
    if (info.section.data[0].name !== '') return <Text style={styles.title}>各学科成绩</Text>;
  };

  _extraUniqueKey = (item ,index) => {
    return "index" + index + item;
  };

  async loadUserData() {
    return await this.props.rootStore.StorageStore.constructor.load('user');
  };

  static async parseGradeData(gradeData) {
    return [{ key: 0, data: gradeData }];
  }

  async saveGradeData(data) {
    await this.props.rootStore.StorageStore.save('grade', data);
  }

  async updateGradeData(year, semester, token) {
    await this.props.rootStore.LoadingStore.loading(true, '同步中...');
    const response = await this.props.rootStore.UserStore.grade(String(year), String(semester), token);
    await this.props.rootStore.LoadingStore.loading(false);
    if (response.code === 201) {
      const parsedGradeData = await this.constructor.parseGradeData(response.data);
      await this.saveGradeData({ parsedGradeData, year, semester });
      this.setState({
        gradeData: parsedGradeData,
        isNull: parsedGradeData[0].data[0].name === '',
        year,
        semester,
        selectedText: `${year} 学年第 ${semester} 学期`,
      });
      return { year, semester, parsedGradeData };
    } else {
      await this.props.rootStore.UserStore.toast('error', '💊 暂时无法获取成绩信息，请稍后重试');
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
          const response = await this.updateGradeData(BUTTONS[buttonIndex].substr(0, 4), BUTTONS[buttonIndex].substr(9, 1), userData.token);
          if (response) await this.setState({
            selectedText: BUTTONS[buttonIndex],
          });
        }
      });
  };

  async componentWillMount() {
    try {
      const gradeData = await this.props.rootStore.StorageStore.constructor.load('grade');
      this.setState({
        gradeData: gradeData.parsedGradeData,
        isNull: gradeData.parsedGradeData[0].data[0].name === '',
        year: gradeData.year,
        semester: gradeData.semester,
        selectedText: `${gradeData.year} 学年第 ${gradeData.semester} 学期`
      });
    } catch (err) {
      const userData = await this.loadUserData();
      await this.updateGradeData(current.year, current.semester, userData.token);
    }
  }

  async refresh() {
    await this.setState({ refreshing: true });
    const userData = await this.loadUserData();
    await this.updateGradeData(this.state.year, this.state.semester, userData.token);
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
          <Text style={styles.noText}>本学期还没有发布成绩&nbsp;🙈</Text>
          <Text style={styles.noText}>试试下拉刷新 or 戳上面切换学期&nbsp;👆</Text>
        </View> : <SectionList
          renderSectionHeader={this._sectionComp}
          renderItem={this._renderItem}
          keyExtractor = {this._extraUniqueKey}
          style={styles.sectionList}
          sections={this.state.gradeData}
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
const $red = 'rgb(217, 74, 74)';
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
  exam: {
    width: '80%',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: $borderColor,
  },
  lastInnerCard: {
    borderBottomWidth: 0,
  },
  status: {
    paddingRight: 15,
    paddingTop: 13,
  },
  name: {
    color: $title,
    fontSize: 17,
    paddingBottom: 10,
    paddingTop: 14,
  },
  info: {
    flexDirection: 'column',
  },
  infoTop: {
    color: $info,
    fontSize: 13,
    paddingBottom: 5,
  },
  infoMiddle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  infoBottom: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingBottom: 5,
  },
  infoText: {
    width: 125,
    color: $info,
    fontSize: 13,
    paddingBottom: 5,
  },
  infoLast: {
    color: $info,
    fontSize: 13,
    paddingBottom: 5,
  },
  final: {
    textAlign: 'right',
    color: $info,
    fontSize: 13,
  },
  date: {
    color: $dateColor,
    fontSize: 17,
    paddingBottom: 7,
    textAlign: 'right',
  },
  flunk: {
    color: $red,
  },
  sectionList: {
    paddingBottom: 20
  },
});
