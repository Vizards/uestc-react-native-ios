import React from 'react';
import propTypes from 'prop-types';

export default class FormProvider extends React.Component {
  static propTypes = {
    form: propTypes.object,
    children: propTypes.element.isRequired,
  };

  static childContextTypes = {
    form: propTypes.object,
  };

  getChildContext() {
    return {
      form: this.props.form,
    };
  }
  render() {
    return React.Children.only(this.props.children);
  }
}
