import React from 'react';
import { Text, View, StyleSheet, ScrollView, RefreshControl, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Echarts from 'react-native-web-echarts';
import { inject, observer } from "mobx-react/native";
import { action } from 'mobx';

import List from './components/List';
import AllGrade from './components/AllGrade';

const SCREEN_WIDTH = Dimensions.get('window').width;


@inject('rootStore')
@observer
export default class Statistic extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      graphData: {},
      gpaData: [],
      refreshing: false,
    }
  }

  async parseGpaData(data) {
    data = data.slice(1);
    let semester = await data.map(item => {
      return `${String(item.year - 2000)}-${String(item.semester)}`;
    });
    const gpa = await data.map(item => {
      return item.gpa;
    });
    const credit = await data.map(item => {
      return item.credit;
    });

    const firstYear = data[0].year - 2000;

    // 学期数未满 8 的补齐到 8
    if(semester.length < 8) semester = [
      `${String(firstYear)}-1`,
      `${String(firstYear)}-2`,
      `${String(firstYear + 1)}-1`,
      `${String(firstYear + 1)}-2`,
      `${String(firstYear + 2)}-1`,
      `${String(firstYear + 2)}-2`,
      `${String(firstYear + 3)}-1`,
      `${String(firstYear + 3)}-2`,
    ];
    if(gpa.length < 8) gpa.length = 8;
    if(credit.length < 8) credit.length = 8;

    // 首尾置空
    await semester.unshift(null);
    await semester.push(null);
    await gpa.unshift(null);
    await gpa.push(null);
    await credit.unshift(null);
    await credit.push(null);

    return { semester, gpa, credit };
  }

  async updateGpa(token) {
    await this.props.rootStore.LoadingStore.loading(true, '同步成绩...');
    const response = await this.props.rootStore.UserStore.gpa(token);
    await this.props.rootStore.LoadingStore.loading(false);
    if (response.code === 200) {
      await this.props.rootStore.StorageStore.save('gpa', response.data);
      const parsedGpaData = await this.parseGpaData(response.data);
      await this.setState({
        gpaData: response.data,
        graphData: parsedGpaData,
      })
    } else {
      await this.props.rootStore.UserStore.toast('error', '💊 暂时无法获取成绩信息，请稍后重试');
      await this.props.rootStore.UserStore.clearToast();
    }
  }

  async componentWillMount() {
    try {
      const gpaData = await this.props.rootStore.StorageStore.constructor.load('gpa');
      const parsedGpaData = await this.parseGpaData(gpaData);
      await this.setState({
        gpaData,
        graphData: parsedGpaData,
      })
    } catch (err) {
      const userData = await this.props.rootStore.StorageStore.constructor.load('user');
      await this.updateGpa(userData.token);
    }
  }

  @action
  async refresh() {
    await this.setState({ refreshing: true });
    const userData = await this.props.rootStore.StorageStore.constructor.load('user');
    await Promise.all([
      this.updateGpa(userData.token),
      this.myCpt.updateAllGrade(userData.token),
    ]);
    await this.setState({ refreshing: false });
  }


  render() {
    const option = {
      title: {
        show: false,
        padding: 0,
        itemGap: 0,
      },
      grid: {
        show: true,
        backgroundColor: 'rgb(252, 252, 252)',
        borderColor: 'rgb(252, 252, 252)',
        zlevel: -1,
        containLabel: true,
        top: 0,
        bottom: 10,
        left: -20,
        right: -20,
        width: SCREEN_WIDTH + 16,
      },
      xAxis : [
        {
          type : 'category',
          boundaryGap : false,
          data : this.state.graphData.semester,
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#000',
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['rgb(226, 226, 227)'],
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgb(226, 226, 227)',
            }
          },
        }
      ],
      yAxis: [
        {
          max: 4,
          min: 0,
          type: 'value',
          axisTick: {
            show: false,
          },
          axisLabel: {
            inside: true,
            margin: 25,
            showMinLabel: false,
            showMaxLabel: false,
            color: 'rgb(96, 145, 246)'
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: 'rgb(226, 226, 227)',
            }
          },
        },
        {
          max: 50,
          min: 0,
          type: 'value',
          axisTick: {
            show: false,
          },
          axisLabel: {
            inside: true,
            margin: 20,
            showMinLabel: false,
            showMaxLabel: false,
            color: 'rgb(74, 217, 100)',
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: 'rgb(226, 226, 227)',
            }
          },
        }
      ],
      series: [
        {
          name: '学期平均 GPA',
          type: 'line',
          itemStyle: {
            normal: {
              color: 'rgb(96, 145, 246)',
            }
          },
          lineStyle: {
            normal: {
              width: 1.5
            }
          },
          symbolSize: 8,
          data: this.state.graphData.gpa,
        },
        {
          name: '学期总学分',
          type: 'line',
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              color: 'rgb(74, 217, 100)',
            }
          },
          lineStyle: {
            normal: {
              width: 1.5
            }
          },
          symbolSize: 8,
          data: this.state.graphData.credit,
        }
      ]
    };
    return (
      <ScrollView>
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this.refresh.bind(this)}
        />
        <View style={styles.chartsOuter}>
          <View style={styles.chartsInner}>
            <Echarts option={option} height={180} width={'100%'}/>
          </View>
          <View style={styles.legend}>
            <Icon name='circle' color='rgb(96, 145, 246)' size={10}/>
            <Text style={styles.legendText}>学期平均 GPA</Text>
            <Icon name='circle' color='rgb(74, 217, 100)' size={10} style={styles.legendIcon}/>
            <Text style={styles.legendText}>学期总学分</Text>
          </View>
        </View>
        <List
          gpaData={this.state.gpaData}
        />
        <AllGrade
          rootStore={this.props.rootStore}
          ref={(c) => {this.myCpt = c;}}
        />
      </ScrollView>
    );
  }
}

const $outerBackgroundColor = '#fff';
const $innerBackgroundColor = 'rgb(252, 252, 252)';
const $innerBorderColor = 'rgb(226, 226, 227)';
const styles = StyleSheet.create({
  chartsOuter: {
    backgroundColor: $outerBackgroundColor,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 18,
    height: 238,
    width: '100%',
  },
  chartsInner: {
    backgroundColor: $innerBackgroundColor,
    height: 180,
    borderColor: $innerBorderColor,
    borderWidth: 1,
    borderRadius: 4,
    width: '100%',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingLeft: 15,
  },
  legendIcon: {
    paddingLeft: 26,
  },
  legendText: {
    paddingLeft: 11,
    paddingBottom: 2,
  },
});
