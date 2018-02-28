import React from 'react';
import { StyleSheet, TouchableOpacity, Text,} from 'react-native';
import propTypes from 'prop-types';
import { observer } from 'mobx-react/native';

const $buttonBackgroundColor = '#a6a6a6';
const $activeBackgroundColor = '#60a5f6';
const $buttonTextColor = '#fff';
const styles = StyleSheet.create({
  button: {
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: $buttonBackgroundColor,
    marginVertical: 5,
    borderRadius: 4,
    marginHorizontal: 21,
  },
  active: {
    backgroundColor: $activeBackgroundColor,
  },
  buttonText: {
    color: $buttonTextColor
  }
});


@observer
export default class Submit extends React.Component {
  static propTypes = {
    children: propTypes.string.isRequired,
    form: propTypes.object,
    onSubmit: propTypes.func,
  };

  static contextTypes = {
    form: propTypes.object,
  };

  render() {
    const { children, onSubmit } = this.props;
    const form = this.context.form || this.props.form;
    return (
      <TouchableOpacity
        style={[styles.button, form.isValid && styles.active]}
        disabled={!form.isValid}
        onPress={onSubmit}
      >
        <Text style={styles.buttonText}>{children}</Text>
      </TouchableOpacity>
    );
  }
}
