import React from 'react';
import { Text, View } from 'react-native';
import Echarts from 'native-echarts';

export default class Statistic extends React.Component {
  render() {
    const option = {
      title: {
        show: false,
        padding: 0,
        itemGap: 0,
      },
      legend: {
        data:['流量','降雨量'],
        x: 'center',
        y: 'bottom',
      },
      xAxis : [
        {
          type : 'category',
          boundaryGap : false,
          data : ['2014-1', '2014-2', '2015-1'],
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
          },
        }
      ],
      yAxis: [
        {
          type: 'value',
          max: 4,
          axisTick: {
            show: false,
          },
          axisLabel: {
            inside: true,
          },
          offset: 0.3,
        },
        {
          max: 50,
          type: 'value',
          axisTick: {
            show: false,
          },
          axisLabel: {
            inside: true,
          }
        }
      ],
      series: [
        {
          name:'流量',
          type:'line',
          animation: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          data: [3, 2, 3, 3],
        },
        {
          name:'降雨量',
          type:'line',
          yAxisIndex:1,
          animation: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          data: [29, 30, 31]
        }
      ]
    };
    return (
      <View style={{ marginTop: -30, marginLeft: -20, marginRight: -20 }}>
        <Echarts option={option} height={300} />
      </View>
    );
  }
}
