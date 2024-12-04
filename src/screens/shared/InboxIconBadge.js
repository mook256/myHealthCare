import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import inboxIcon from '../../assets/icons/inbox.png';
import inboxDefaultIcon from '../../assets/icons/inbox-default.png';

export default class InboxIconBadge extends Component {
  render() {
    const { focused, notification, mode } = this.props;
    const { badge } = notification;
    if (mode === 'bottom') {
      return (
        <View style={styles.container}>
          <Image
            style={{ width: 24, height: 24 }}
            source={focused ? inboxIcon : inboxDefaultIcon}
          />
          {badge > 0 && (
            <View style={styles.block}>
              <Text style={styles.text}>{badge}</Text>
            </View>
          )}
        </View>
      );
    }
    return (
      <View style={styles.containerTop}>
        <Icon name="ios-archive" style={{ color: '#90a4ae' }} size={24} />
        {badge > 0 && (
          <View style={styles.blockLeft}>
            <Text style={styles.text}>{badge}</Text>
          </View>
        )}
      </View>
    );
  }
}

InboxIconBadge.propTypes = {
  focused: PropTypes.bool.isRequired,
  notification: PropTypes.shape({
    badge: PropTypes.number,
  }).isRequired,
  mode: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    margin: 5,
  },
  containerTop: {
    width: 28,
    height: 24,
    margin: 5,
  },
  block: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockLeft: {
    position: 'absolute',
    right: 1,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
});
