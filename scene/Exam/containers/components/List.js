import React from 'react';
import { Text, View, StyleSheet, SectionList } from 'react-native';

export default class List extends React.Component {

  constructor(props) {
    super(props);
  }

  _renderItem = (info) => {
    return (
      <View style={[styles.wrapper, info.index === 0 && styles.firstCard, info.index === info.section.data.length - 1 && styles.lastCard]}>
        <View style={[styles.inner, info.index === info.section.data.length - 1 && styles.lastInnerCard]}>
          <View style={styles.top}>
            <Text style={styles.semester}>{info.item.year === 0 ? '总计' : `${info.item.year} 学年第 ${info.item.semester} 学期`}</Text>
            <View>
              <Text style={styles.gpaData}>{info.item.gpa}</Text>
            </View>
          </View>
          <View style={styles.bottom}>
            <Text style={styles.subject}>科目：{info.item.subject} 门   总学分：{info.item.credit}</Text>
            <Text style={styles.gpa}>GPA</Text>
          </View>
        </View>
      </View>
    )
  };

  _sectionComp = (info) => {
    const key = info.section.key;
    if (key === 'gpaData' && info.section.data.length !== 0) return <Text style={styles.title}>详细数据</Text>;
  };

  _extraUniqueKey = (item, index) => {
    return "index" + index + item;
  };

  render() {
    const gpaData = [{ key: 'gpaData', data: this.props.gpaData }];
    return (<View>
      <SectionList
        renderSectionHeader={this._sectionComp}
        renderItem={this._renderItem}
        keyExtractor = {this._extraUniqueKey}
        sections={gpaData}
      />
    </View>)
  }
};

const $listBackgroundColor = '#fff';
const $borderColor = 'rgb(200, 199, 204)';
const $titleColor = 'rgb(109, 109, 114)';
const $semesterColor = 'rgb(3, 3, 3)';
const $dataColor = 'rgba(3, 3, 3, 0.3)';
const $gpaColor = 'rgb(74, 217, 100)';
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: $listBackgroundColor,
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
  title: {
    paddingLeft: 15,
    paddingBottom: 7,
    paddingTop: 6,
    fontSize: 13,
    color: $titleColor,
  },
  inner: {
    flexDirection: 'column',
    justifyContent: 'center',
    borderBottomColor: $borderColor,
    borderBottomWidth: 0.5,
  },
  lastInnerCard: {
    borderBottomWidth: 0,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 9,
    paddingBottom: 9,
  },
  bottom: {
    paddingBottom: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  semester: {
    fontSize: 17,
    color: $semesterColor,
  },
  subject: {
    color: $dataColor,
    fontSize: 13,
  },
  gpaData: {
    fontSize: 17,
    color: $gpaColor,
    paddingRight: 16,
  },
  gpa: {
    color: $dataColor,
    fontSize: 13,
    paddingRight: 16,
  }
});
