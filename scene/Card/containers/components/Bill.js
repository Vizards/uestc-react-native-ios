import React from 'react';
import {Text, ScrollView, View, TouchableOpacity, StyleSheet, SectionList, Alert, Dimensions, ActivityIndicator } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class Bill extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bill: [],
      totalConsume: '',
      totalRecharge: '',
      disappear: false,
    }
  }
  _renderItem = (info) => {
    const type = info.item.type,
      amount = info.item.amount,
      position = info.item.position.length > 15 ? `${info.item.position.substr(0, 14)}...` : info.item.position,
      befbala = info.item.befbala,
      aftbala = info.item.aftbala;
    return (
      info.section.data.length !== 0 ? <View style={styles.card}>
        <View style={styles.inner}>
          <View style={styles.exam}>
            <Text style={styles.name}>{position}</Text>
            <View style={styles.info}>
              <Text style={styles.infoText}>消费前：￥{befbala}</Text>
              <Text style={styles.infoText}>消费后：￥{aftbala}</Text>
            </View>
          </View>
          <View style={styles.status}>
            <Text style={[styles.date, Number(amount) < 0 && styles.red]}>{amount}</Text>
            <Text style={styles.final}>{type}</Text>
          </View>
        </View>
      </View> : null
    )
  };

  _sectionComp = (info) => {
    if (info.section.data.length === 0) return null;
    if (info.section.data[0].name !== '') return <View style={styles.title}>
      <Text style={styles.titleText}>本月消费￥{this.state.totalConsume}</Text>
      <Text style={styles.titleText}>本月充值￥{this.state.totalRecharge}</Text>
    </View>;
  };

  _extraUniqueKey = (item ,index) => {
    return "index" + index + item;
  };

  static async parseData(data) {
    return [{ key: 0, data }];
  }

  async getBill(token) {
    await this.setState({
      disappear: false,
    });
    const response = await this.props.rootStore.UserStore.bill(token);
    const parsedData = await this.constructor.parseData(response.data.consumes);
    if (response.code === 200) {
      await this.setState({
        bill: parsedData,
        totalConsume: response.data.total_consume,
        totalRecharge: response.data.total_recharge,
        disappear: true,
      });
    } else {
      await this.props.rootStore.UserStore.toast('error', '暂时无法获取消费账单，请稍后重试');
      await this.props.rootStore.UserStore.clearToast();
    }
  }

  async componentWillMount() {
    if (this.props.rootStore.xiFuStore.allData.xiFuBind === true) {
      const userData = await this.props.rootStore.StorageStore.constructor.load('user');
      await this.getBill(userData.token);
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={[styles.load_box, this.state.disappear && styles.disappear]}>
          <ActivityIndicator
            animating={true}
            color={'#000'}
            size={'large'}
            style={styles.load_progress} />
          <Text style={styles.load_text}>获取最近账单</Text>
        </View>
        <SectionList
          renderSectionHeader={this._sectionComp}
          renderItem={this._renderItem}
          keyExtractor = {this._extraUniqueKey}
          sections={this.state.bill}
        />
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.Button}
            onPress={() => Alert.alert(
              '确认退出吗？',
              '\n退出后，您需要重新登录喜付才能查看一卡通和电费信息',
              [
                {text: '取消', style: 'cancel'},
                {text: '确定', onPress: async () => {
                  await this.props.rootStore.StorageStore.constructor.remove('xifu');
                  await this.props.rootStore.xiFuStore.setBind(false, '');
                  await this.props.navigation.push('XiFuLogin');
                }},
              ]
            )}
          >
            <Text style={styles.buttonText}>切换喜付账号</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const $frontColor = '#fff';
const $textInputBackgroundColor = '#fff';
const $title = 'rgb(3,3,3)';
const $info = 'rgba(3,3,3,0.3)';
const $dateColor = 'rgb(74, 217, 100)';
const $borderColor = 'rgb(200, 199, 204)';
const $buttonBackgroundColor = 'rgb(96, 165, 246)';
const $titleColor = 'rgb(109, 109, 114)';
const $red = 'rgb(217, 74, 74)';
const $loadBoxBackgroundColor = 'transparent';
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  exam: {
    width: '80%',
  },
  card: {
    backgroundColor: $frontColor,
    paddingLeft: 15,
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 0.5,
    borderBottomColor: $borderColor,
    paddingTop: 14,
    paddingBottom: 10,
  },
  status: {
    paddingRight: 15,
  },
  name: {
    color: $title,
    fontSize: 17,
    paddingBottom: 10,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  infoText: {
    color: $info,
    fontSize: 13,
    paddingRight: 15,
    width: 120,
  },
  final: {
    textAlign: 'right',
    color: $info,
    fontSize: 13,
  },
  date: {
    color: $dateColor,
    fontSize: 17,
    paddingBottom: 10,
    textAlign: 'right',
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 16,
    paddingBottom: 7,
  },
  titleText: {
    color: $titleColor
  },
  red: {
    color: $red,
  },
  load_box: {
    width: 100,
    height: SCREEN_HEIGHT - 360 - 43.5 - 48.5 - 20,
    alignItems: 'center',
    marginLeft: SCREEN_WIDTH / 2 - 50,
    marginTop: (SCREEN_HEIGHT - 360 - 43.5 - 48.5 - 20) / 2 - 50,
    backgroundColor: $loadBoxBackgroundColor,
  },
  load_progress: {
    position: 'absolute',
    width: 100,
    height: 90,
  },
  load_text: {
    marginTop: 70,
    color: $info,
    fontSize: 13,
  },
  disappear: {
    display: 'none'
  }
});