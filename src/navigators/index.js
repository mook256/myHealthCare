import React from 'react';

import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import LoadingScreenContainer from '../screens/loading/LoadingScreenContainer';
import KeyConfigScreenContainer from '../screens/keyConfig/KeyConfigScreenContainer';
import MainNavigator from '../screens/MainNavigator';
import NavigationService from '../services/NavigationService';
import QRConfigScreenContainer from '../screens/keyConfig/QRConfigScreenContainer';

const SwitchNavigator = createSwitchNavigator(
  {
    KeyConfig: KeyConfigScreenContainer,
    QRConfig: QRConfigScreenContainer,
    Loading: LoadingScreenContainer,
    App: MainNavigator,
  },
  {
    initialRouteName: 'Loading',
  },
);

const AppContainer = createAppContainer(SwitchNavigator);

export default class AppNavigator extends AppContainer {
  render() {
    return (
      <AppContainer
        {...this.props}
        ref={(navigatorRef) =>
          NavigationService.setTopLevelNavigator(navigatorRef)
        }
      />
    );
  }
}
