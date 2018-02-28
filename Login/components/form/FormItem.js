import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { observer } from 'mobx-react/native';
import propTypes from 'prop-types';
import { action } from 'mobx';
import camelCase from 'camelcase';
import Toaster from 'react-native-toaster'

@observer
export default class FormItem extends React.Component {
  static propTypes = {
    name: propTypes.string.isRequired,
    form: propTypes.object,
    children: propTypes.string.isRequired,
    autoFocus: propTypes.boolean,

    ...TextInput.propTypes,
  };

  static contextTypes = {
    form: propTypes.object,
  };

  state = {
    focused: this.props.autoFocus,
  };

  @action
  onChangeText = (text) => {
    const { name } = this.props;
    const form = this.context.form || this.props.form;
    form[name] = text;
  };

  @action
  onFocus = () => {
    if (!this.state.focused) {
      this.setState({
        focused: true
      })
    }
  };

  render() {
    const {
      name,
      children,
      form: _,
      ...others
    } = this.props;
    const { focused } = this.state;
    const form = this.context.form || this.props.form;
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.inputWrapper}>
            <TextInput
              {...others}
              onFocus={this.onFocus}
              value={form[name]}
              onChangeText={this.onChangeText}
              style={styles.input}
              placeholder={children}
            />
          </View>
        </View>
        <View>
          {focused && <Text style={styles.error}>{form[camelCase('validateError', name)]}</Text>}
        </View>
      </View>
    );
  }
}

const $errorColor = '#fff';
const styles = StyleSheet.create({
  container: {},
  row: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 3,
    borderWidth: 1,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 0,
  },
  error: {
    color: $errorColor,
  },
});
