import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Text, View, SectionList, RefreshControl, ScrollView, TouchableOpacity, StyleSheet, ActionSheetIOS } from 'react-native';
import { inject, observer } from "mobx-react/native";

const semester = require('../../../common/helpers/semester');
const current = require('../../../common/helpers/current');

@inject('rootStore')
@observer
export default class Grade extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gradeData: [],
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
      info.section.data[0].name !== '' ? <View style={styles.card}>
        <View style={styles.inner}>
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
    if (response.code === 201) {
      await this.props.rootStore.LoadingStore.loading(false);
      const parsedGradeData = await this.constructor.parseGradeData(response.data);
      await this.saveGradeData({ parsedGradeData, year, semester });
      this.setState({
        gradeData: parsedGradeData,
        year,
        semester,
        selectedText: `${year} 学年第 ${semester} 学期`,
      });
      return { year, semester, parsedGradeData };
    } else {
      await this.props.rootStore.LoadingStore.loading(false);
      await this.props.rootStore.UserStore.toast('error', '暂时无法获取成绩信息，请稍后重试');
      await this.props.rootStore.UserStore.clearToast();
    }
  }

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
          await this.setState({
            selectedText: BUTTONS[buttonIndex],
          });
          const userData = await this.loadUserData();
          await this.updateGradeData(BUTTONS[buttonIndex].substr(0, 4), BUTTONS[buttonIndex].substr(9, 1), userData.token);
        }
      });
  };

  async componentWillMount() {
    try {
      const gradeData = await this.props.rootStore.StorageStore.constructor.load('grade');
      this.setState({
        gradeData: gradeData.parsedGradeData,
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
            <Ionicons style={styles.rightIcon} name="ios-arrow-forward" size={21}/>
          </View>
        </TouchableOpacity>
        <SectionList
          renderSectionHeader={this._sectionComp}
          renderItem={this._renderItem}
          keyExtractor = {this._extraUniqueKey}
          sections={this.state.gradeData}
        />
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
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: $borderColor,
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
  }
});
