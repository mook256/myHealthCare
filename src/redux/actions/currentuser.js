/* eslint-disable */
import isEmpty from 'lodash/isEmpty';
import { NavigationActions, StackActions } from 'react-navigation';
import RNRestart from 'react-native-restart';
import RestartTimer from '../../RestartTimer';

export function setCurrentUser(user) {
  return (dispatch) => {
    if (!isEmpty(user)) {
      dispatch({ type: 'SET_CURRENT_USER_SUCCESS', payload: user });
      RestartTimer.stop();
      return dispatch(NavigationActions.navigate({ routeName: 'License' }));
    }
  };
}

export function clearCurrentUser() {
  return (dispatch) => {
    dispatch({ type: 'CLEAR_CURRENT_USER' });
    dispatch({ type: 'CLEAR_CURRENT_DETAIL' });
    dispatch({ type: 'DECREMENT_PROGRESS' });
    // // clear navigation stack
    // const resetAction = StackActions.reset({
    //   index: 0,
    //   actions: [NavigationActions.navigate({ routeName: 'Login' })],
    // });
    // dispatch(resetAction);
    RNRestart.Restart();
  };
}
