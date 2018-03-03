import React from 'react';
import { View, Text, SegmentedControlIOS, StyleSheet } from 'react-native';

import Arrangement from './components/arrangement';
import Grade from './components/grade';
import Statistics from './components/statistics';


export default class Exam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayItem: 0,
    }
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const headerComponent = <View style={styles.title}>
      <Text style={styles.titleText}>考试 & 成绩</Text>
      <SegmentedControlIOS
        style={styles.segmentedControl}
        values={['考试安排', '学期成绩', '成绩统计']}
        tintColor='rgb(96, 165, 246)'
        selectedIndex={0}
        onValueChange={params.switchScene}
      />
    </View>;
    return {
      headerTitle: headerComponent,
      headerStyle: {
        height: 85,
      },
    }
  };

  async _switchScene(value) {
    console.log(value);
    if (value === '考试安排') this.setState({ displayItem: 0 });
    if (value === '学期成绩') this.setState({ displayItem: 1 });
    if (value === '成绩统计') this.setState({ displayItem: 2 });
  }

  async componentWillMount() {
    await this.props.navigation.setParams({ switchScene: this._switchScene.bind(this) })
  }

  render() {
    const componentArray = [<Arrangement/>, <Grade/>, <Statistics/>];
    return (
      <View>
        {componentArray[this.state.displayItem]}
      </View>
    );
  }
}

const $titleTextColor = 'rgba(0, 0, 0, 0.9)';
const styles = StyleSheet.create({
  title: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  titleText: {
    fontSize: 17,
    fontWeight: '700',
    color: $titleTextColor,
    textAlign: 'center',
    paddingBottom: 12,
  },
  segmentedControl: {
    width: '100%',
  }
});
