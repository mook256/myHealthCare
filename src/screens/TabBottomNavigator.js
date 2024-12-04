/* eslint-disable */
import React, {Component} from 'react';
import {View} from 'react-native';
import Navigator from '../navigators/tabBottom';
import ConnectionStatus from './shared/ConnectionStatusContainer';

export default class TabBottomNavigator extends Component {
  static router = {
    ...Navigator.router,
    getStateForAction: (action, lastState) =>
      Navigator.router.getStateForAction(action, lastState),
  };

  render() {
    const {navigation} = this.props;
    return (
      <View style={{flex: 1}}>
        <Navigator navigation={navigation} />
        <ConnectionStatus />
      </View>
    );
  }
}

TabBottomNavigator.navigationOptions = ({navigation}) => {
  if (navigation.state.index === 4) {
    return {title: 'กล่องจดหมาย'};
  }

  return {headerShown: false};
};
