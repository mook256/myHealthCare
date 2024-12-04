import React, { PureComponent } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { colors, fonts } from '../../styles';

export default class ConnectionStatus extends PureComponent {
  render() {
    const { isNetWorkConnected } = this.props;
    if (isNetWorkConnected) {
      return null;
    }

    return (
      <View style={styles.content}>
        <Text style={styles.massage}>No internet Connection</Text>
      </View>
    );
  }
}

ConnectionStatus.propTypes = {
  isNetWorkConnected: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    paddingTop: 2,
    backgroundColor: colors.dark,
  },
  massage: {
    color: colors.textWhite,
    fontSize: fonts.small,
    textAlign: 'center',
  },
});
