import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Echarts from 'react-native-web-echarts';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

export default class Graph extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      eCard: {},
      eCardBalance: 0,
      electricity: {},
      electricityBalance: 0,
      isEcardReady: false,
      isElectricityReady: false
    }
  }

  async getEcard(token) {
    await this.setState({
      isEcardReady: false,
      eCardBalance: 0,
    });
    const response = await this.props.rootStore.UserStore.ecard(token);
    if (response.code === 200) {
      await this.setState({
        eCard: response.data,
        eCardBalance: Number(response.data.balance),
        isEcardReady: true,
      })
    } else {
      await this.props.rootStore.UserStore.toast('error', '暂时无法获取一卡通信息，请稍后重试');
      await this.props.rootStore.UserStore.clearToast();
    }
  }

  async getElectricity(token) {
    await this.setState({
      isElectricityReady: false,
      electricityBalance: 0,
    });
    const response = await this.props.rootStore.UserStore.electricity(token);
    if (response.code === 201) {
      await this.setState({
        electricity: response.data,
        electricityBalance: Number(response.data.amount),
        isElectricityReady: true,
      })
    } else {
      await this.props.rootStore.UserStore.toast('error', '暂时无法获取电费信息，请稍后重试');
      await this.props.rootStore.UserStore.clearToast();
    }
  }

  async componentWillMount() {
    if (this.props.rootStore.xiFuStore.allData.xiFuBind === true) {
      const userData = await this.props.rootStore.StorageStore.constructor.load('user');
      await this.getEcard(userData.token);
      await this.getElectricity(userData.token);
    }
  }

  render() {
    const option = {
      grid: {
        top: 0,
        bottom: -10,
        left: -20,
        right: -20,
      },
      series: [
        {
          name: '一卡通',
          type: 'gauge',
          center: ['50%', '25%'],
          data: [{value: Number(this.state.eCardBalance)}],
          radius: '80%',
          min: 0,
          max: this.state.eCardBalance > 240 ? this.state.eCardBalance : 240,
          splitNumber: 6,
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              width: 10,
              color: [[0.1666666666, $red], [0.833333333, $blue], [1, $green]]
            }
          },
          axisLabel: {
            distance: -18,
          },
          axisTick: {
            splitNumber: 1,
          },
          pointer: {
            width: 5,
          },
          detail: {
            formatter: '一卡通',
            fontSize: 14,
            offsetCenter: [0, '35%']
          }
        },
        {
          name: '电费',
          type: 'gauge',
          center: ['50%', '75%'],
          data: [{value: Number(this.state.electricityBalance)}],
          radius: '80%',
          splitNumber: 5,
          splitLine: {
            show: false,
          },
          min: 0,
          max: this.state.electricityBalance > 50 ? this.state.electricityBalance : 50,
          axisLine: {
            lineStyle: {
              width: 10,
              color: [[0.2, $red], [0.8, $blue], [1, $green]]
            }
          },
          axisLabel: {
            distance: -18,
          },
          axisTick: {
            splitNumber: 1,
          },
          pointer: {
            width: 5,
          },
          detail: {
            formatter: '电费',
            fontSize: 14,
          }
        }
      ]
    };
    return (
      <View style={styles.container}>
        <View style={styles.col}>
          <Echarts option={option} height={360} width={'100%'}/>
        </View>
        <View style={styles.col}>
          <View style={styles.row}>
            <View style={styles.inner}>
              <ShimmerPlaceHolder style={styles.shimmer} width={'90%'} autoRun={true} visible={this.state.isEcardReady}>
                <Text style={[styles.eCardBalance, this.state.eCardBalance > 40 ? styles.blue : this.state.eCardBalance > 200 ? styles.green : styles.red]}>￥{this.state.eCardBalance}</Text>
              </ShimmerPlaceHolder>
              <ShimmerPlaceHolder style={styles.shimmer} width={'30%'} autoRun={true} visible={this.state.isEcardReady}>
                <Text style={styles.text}>卡状态：{this.state.eCard.card_status === '正常' ? '正常使用' : '卡已挂失'}</Text>
              </ShimmerPlaceHolder>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.inner}>
              <ShimmerPlaceHolder style={styles.shimmer} width={'90%'} autoRun={true} visible={this.state.isElectricityReady}>
                <Text style={[styles.eCardBalance, this.state.electricityBalance > 40 ? styles.blue : this.state.eCardBalance > 200 ? styles.green : styles.red]}>￥{this.state.electricityBalance}</Text>
              </ShimmerPlaceHolder>
              <ShimmerPlaceHolder style={styles.shimmer} width={'70%'} autoRun={true} visible={this.state.isElectricityReady}>
                <Text style={styles.text}>电量剩余：{this.state.electricity.balance} 度</Text>
              </ShimmerPlaceHolder>
              <ShimmerPlaceHolder style={styles.shimmer} width={'90%'} autoRun={true} visible={this.state.isElectricityReady}>
                <Text style={styles.text}>绑定房间号：{this.state.electricity.room}</Text>
              </ShimmerPlaceHolder>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const $graphBackgroundColor = '#fff';
const $red = 'rgb(217, 74, 74)';
const $blue = 'rgb(96, 165, 246)';
const $green = 'rgb(74, 217, 100)';
const $textColor = 'rgba(3, 3, 3, 0.3)';
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 360,
    width: '100%',
    backgroundColor: $graphBackgroundColor,
  },
  col: {
    width: '50%',
  },
  row: {
    width: '100%',
    height: '50%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },
  inner: {
    width: '80%',
  },
  shimmer: {
    marginTop: 5,
  },
  eCardBalance: {
    fontSize: 36,
    fontWeight: 'bold',
    marginLeft: -10
  },
  red: {
    color: $red,
  },
  blue: {
    color: $blue,
  },
  green: {
    color: $green,
  },
  text: {
    paddingTop: 8,
    color: $textColor,
  }
});
