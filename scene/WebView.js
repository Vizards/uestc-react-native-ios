import React from 'react';
import WKWebView from 'react-native-wkwebview-reborn';

export default class WebView extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params;
    return {
      headerTitle: params.title,
      gesturesEnabled: params.gesturesEnabled,
    }
  };

  async _onNavigationStateChange(navState) {
    await this.props.navigation.setParams({ gesturesEnabled: !navState.canGoBack })
  };

  async componentWillMount() {
    await this.props.navigation.setParams({ onNavigationStateChange: this._onNavigationStateChange.bind(this) })
  };

  render() {
    const { params } = this.props.navigation.state;
    return <WKWebView
      onNavigationStateChange={this._onNavigationStateChange.bind(this)}
      allowsBackForwardNavigationGestures={true}
      startInLoadingState={true}
      source={{ uri: params.url }}
    />
  }
}