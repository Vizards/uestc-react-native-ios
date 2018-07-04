import React from 'react';
import WKWebView from 'react-native-wkwebview-reborn';

export default class WebView extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params;
    return {
      headerTitle: params.title,
      gesturesEnabled: params.gesturesEnabled,
      headerStyle: params.sendCookies ? {
        borderBottomWidth: 0,
      } : {}
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
    const script = `
      const link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('type', 'text/css');
      link.setAttribute('href', 'https://o9wj5x8i4.qnssl.com/library/style-2018-05-12-2.css');
      document.getElementsByTagName('head')[0].appendChild(link);
      const button = document.createElement('div');
      button.setAttribute('id', 'navButton');
      const ul = document.createElement('ul');
      ul.setAttribute('id', 'navUl');
      const links = [{
          url: 'http://222.197.165.97:8080/sms/opac/search/showSearch.action?xc=5',
          title: '馆藏查询'
      },{
          url: 'http://mc.m.5read.com/user/uc/showPersonalSet.jspx',
          title: '个人中心'
      }];
      // 第一个按钮
      links.forEach(function(e, index) {
          let li = document.createElement('li');
          let a = document.createElement('a');
          a.href = e.url;
          a.id = 'link' + index;
          a.innerText = e.title;
          li.appendChild(a);
          ul.appendChild(li);
      });
      button.appendChild(ul);
      document.getElementsByTagName('body')[0].appendChild(button);
      if (window.location.href.indexOf('222.197.165.97') !== -1 && window.location.href.indexOf('/opac/user/') === -1) {
          document.querySelector('#link0').style.background = 'rgb(96, 145, 246)';
          document.querySelector('#link0').style.color = '#fff';
      }
      if (window.location.href.indexOf('5read.com') !== -1 || window.location.href.indexOf('/opac/user/') !== -1) {
          document.querySelector('#link1').style.background = 'rgb(96, 145, 246)';
          document.querySelector('#link1').style.color = '#fff';
      }
      if (window.location.href.indexOf('222.197.165.97') !== -1) {
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.innerText = '搜索';
        submitButton.className = 'searchButton';
        document.getElementsByClassName('searchForm')[0].appendChild(submitButton);
      }
      // 个人中心页面添加链接
      const navlinks = [{
          url: 'http://mc.m.5read.com/cmpt/opac/opacLink.jspx?stype=1',
          title: '个人借阅信息'
      }, {
          url: 'http://mc.m.5read.com/cmpt/opac/opacLink.jspx?stype=2',
          title: '借阅历史'
      }, {
          url: 'http://mc.m.5read.com/cmpt/opac/opacLink.jspx?stype=3',
          title: '预约历史'
      }];
      const firstLi = document.querySelector('.set').getElementsByTagName('li')[0];
      navlinks.forEach(function(e) {
          let li = document.createElement('li');
          let a = document.createElement('a');
          a.href = e.url;
          a.innerText = e.title;
          li.appendChild(a);
          document.querySelector('.set').insertBefore(li, firstLi);
      });
      document.querySelector('')
    `;
    return <WKWebView
      onNavigationStateChange={this._onNavigationStateChange.bind(this)}
      allowsBackForwardNavigationGestures={true}
      startInLoadingState={true}
      injectedJavaScript={params.sendCookies ? script : null}
      sendCookies={params.sendCookies}
      source={{ uri: params.url }}
    />
  }
}