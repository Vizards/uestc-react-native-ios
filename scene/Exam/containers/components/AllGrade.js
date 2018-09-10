import React from 'react';
import { Text, View, SectionList, StyleSheet} from 'react-native';

export default class AllGrade extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      allGradeData: [],
    };
  }

  _renderItem = (info) => {
    const type = info.item.type,
      final = isNaN(Number(info.item.final)) ? info.item.final : Number(info.item.final),
      credit = info.item.credit,
      overall = info.item.overall,
      name = info.item.name.length < 13 ? info.item.name : `${info.item.name.substr(0, 12)}...`,
      resit = info.item.resit === '' ? '--' : info.item.resit;
    return (
      info.section.data[0].name !== '' ? <View style={[styles.card, info.index === 0 && styles.firstCard, info.index === info.section.data.length - 1 && styles.lastCard]}>
        <View style={[styles.inner, info.index === info.section.data.length - 1 && styles.lastInnerCard]}>
          <View style={styles.exam}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.info}>
              <Text style={styles.infoTop}>{type}</Text>
              <View style={styles.infoMiddle}>
                <Text style={styles.infoText}>学分：{credit}</Text>
              </View>
              <View style={styles.infoBottom}>
                <Text style={styles.infoText}>补考总评：{resit}</Text>
                <Text style={styles.infoLast}>总评成绩：{overall}</Text>
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
    if (info.section.data[0].name !== '') return <Text style={styles.title}>所有学科成绩</Text>;
  };

  _extraUniqueKey = (item ,index) => {
    return "index" + index + item;
  };

  async updateAllGrade(token) {
    await this.props.rootStore.LoadingStore.loading(true, '同步学科...');
    const response = await this.props.rootStore.UserStore.allGrade(token);
    await this.props.rootStore.LoadingStore.loading(false);
    if (response.code === 200) {
      await this.props.rootStore.StorageStore.save('allGrade', response.data.sort((x, y) => { return x.type > y.type }));
      await this.setState({
        allGradeData: [{ key: 'allGrade', data: response.data.sort((x, y) => { return x.type > y.type }) }],
      });
    } else {
      await this.props.rootStore.UserStore.toast('error', '💊 暂时无法获取成绩信息，请稍后重试');
      await this.props.rootStore.UserStore.clearToast();
    }
  }

  async componentWillMount() {
    try {
      const allGradeData = await this.props.rootStore.StorageStore.constructor.load('allGrade');
      await this.setState({ allGradeData: [{ key: 'allGrade', data: allGradeData }] });
    } catch (err) {
      const userData = await this.props.rootStore.StorageStore.constructor.load('user');
      await this.updateAllGrade(userData.token);
    }
  }

  render() {
    return (
      <SectionList
        renderSectionHeader={this._sectionComp}
        renderItem={this._renderItem}
        keyExtractor = {this._extraUniqueKey}
        style={styles.sectionList}
        sections={this.state.allGradeData}
      />
    )
  }
}

const $frontColor = '#fff';
const $titleColor = 'rgb(109, 109, 114)';
const $borderColor = 'rgb(200, 199, 204)';
const $title = 'rgb(3,3,3)';
const $info = 'rgba(3,3,3,0.3)';
const $dateColor = 'rgb(74, 217, 100)';
const $red = 'rgb(217, 74, 74)';
const styles = StyleSheet.create({
  exam: {
    width: '80%',
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
    width: 110,
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