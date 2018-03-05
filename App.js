import React from 'react';
import AppRoot from './AppRoot';

import { Provider } from 'mobx-react';
import store from './mobx/store';

export default class App extends React.Component {

  render() {
    return (
      <Provider rootStore={store}>
        <AppRoot />
      </Provider>
    )
  }
}
