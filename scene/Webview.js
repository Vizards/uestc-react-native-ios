import React from 'react';
import { View, StyleSheet, WebView, TouchableOpacity, ActionSheetIOS } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { inject, observer } from "mobx-react/native";

@inject('rootStore')
@observer
export default class Web extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: params.title,
      headerRight: <TouchableOpacity
        style={styles.menu}
        onPress={params.showActionSheet}
      >
        <Icon name={'dots-horizontal'} size={28}/>
      </TouchableOpacity>,
    }
  };

  async _onNavigationStateChange(webViewState) {
    await this.props.rootStore.webViewStore.setUrl(webViewState.url);
  }

  static async _showActionSheet(rootStore) {
    const url = await rootStore.webViewStore.allData.url;
    await ActionSheetIOS.showShareActionSheetWithOptions({
      url,
    }, () => {return false}, () => {return false});
  }

  async componentWillMount() {
    const rootStore = await this.props.rootStore;
    await this.props.navigation.setParams({ showActionSheet: this.constructor._showActionSheet.bind(this, rootStore) });
  }

  render() {
    return (
      <View style={styles.container}>
        <WebView
          source={{ uri: this.props.navigation.state.params.url }}
          onNavigationStateChange={this._onNavigationStateChange.bind(this)}
          rootStore={this.props.rootStore}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menu: {
    paddingRight: 15,
    paddingTop: 5,
  }
});
