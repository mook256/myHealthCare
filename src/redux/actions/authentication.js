import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions } from 'react-navigation';
import { change } from 'redux-form';
import md5 from 'md5';
import Parse from 'parse/react-native';
import moment from 'moment';
import { updateInstallation } from '../../services/ParseService';
import { clearError } from './error';
import { decrementProgress, incrementProgress } from './progress';
import { sendOTP } from '../../services/OtpService';
import { MHW_HOST } from '../../utils/constants';

export const loginAttempt = () => ({ type: 'AUTHENTICATION_LOGIN_ATTEMPT' });
export const loginSuccess = (json) => ({
  type: 'AUTHENTICATION_LOGIN_SUCCESS',
  json,
});
export const loginFailure = (error) => ({
  type: 'AUTHENTICATION_LOGIN_FAILURE',
  error,
});
export const twoFactorSuccess = (json) => ({
  type: 'AUTHENTICATION_TWOFACTOR_SUCCESS',
  json,
});
export const twoFactorFailure = (error) => ({
  type: 'AUTHENTICATION_TWOFACTOR_FAILURE',
  error,
});
export const logoutSuccess = () => ({ type: 'AUTHENTICATION_LOGOUT_SUCCESS' });
export const logoutFailure = (error) => ({
  type: 'AUTHENTICATION_LOGOUT_FAILURE',
  error,
});
export const registrationSuccess = () => ({
  type: 'AUTHENTICATION_REGISTRATION_SUCCESS',
});
export const registrationFailure = (error) => ({
  type: 'AUTHENTICATION_REGISTRATION_FAILURE',
  error,
});
export const tokenCheckFailure = (error) => ({
  type: 'AUTHENTICATION_TOKEN_CHECK_FAILURE',
  error,
});
export const tokenCheckSuccess = (json) => ({
  type: 'AUTHENTICATION_TOKEN_CHECK_SUCCESS',
  json,
});
export const passwordResetClear = () => ({
  type: 'AUTHENTICATION_PASSWORD_RESET_CLEAR',
});
export const passwordResetHashCreated = () => ({
  type: 'AUTHENTICATION_PASSWORD_RESET_HASH_CREATED',
});
export const passwordResetHashFailure = (error) => ({
  type: 'AUTHENTICATION_PASSWORD_RESET_HASH_FAILURE',
  error,
});
export const passwordSaveClear = () => ({
  type: 'AUTHENTICATION_PASSWORD_SAVE_CLEAR',
});
export const passwordSaveFailure = (error) => ({
  type: 'AUTHENTICATION_PASSWORD_SAVE_FAILURE',
  error,
});
export const passwordSaveSuccess = () => ({
  type: 'AUTHENTICATION_PASSWORD_SAVE_SUCCESS',
});
export const lastFetchedSuccess = (json) => ({
  type: 'AUTHENTICATION_LAST_FETCHED_SUCCESS',
  json,
});
export const lastFetchedFailure = (error) => ({
  type: 'AUTHENTICATION_LAST_FETCHED_FAILURE',
  error,
});

export function fetchUser() {
  return async (dispatch) => {
    try {
      const currentUser = await Parse.User.currentAsync();
      // console.log('currentUser', currentUser);
      if (currentUser) {
        const userDetail = await AsyncStorage.getItem('@USER');
        const newUserdetail = JSON.parse(userDetail);

        const isToFactorConfirmed =
          (await AsyncStorage.getItem(
            '@AUTHENTICATION_TWO_FACTOR_CONFIRMED',
          )) === 'SUCCESS';

        dispatch(
          tokenCheckSuccess({
            objectId: currentUser.id,
            id: currentUser.get('userid'),
            token: currentUser.get('sessionToken'),
            username: currentUser.get('username'),
            avatar: `${MHW_HOST}/files/avatar_120/${currentUser.get('avatar')}`,
            firstName: newUserdetail.firstName,
            lastName: newUserdetail.lastName,
            gender: newUserdetail.gender,
            dob: newUserdetail.dob,
            age: moment().diff(newUserdetail.dob, 'years'),
            isToFactorConfirmed,
          }),
        );
      }
    } catch (error) {
      dispatch(tokenCheckFailure(error));
    }
  };
}

// Log User In
export function logUserIn({ username, password }) {
  return async (dispatch, getState) => {
    try {
      // clear the error box if it's displayed
      dispatch(clearError());

      // turn on spinner
      dispatch(incrementProgress());

      // register that a login attempt is being made
      dispatch(loginAttempt());

      let newUsername = username;
      let userdetail;

      // login with idcard
      if (username.match(/^[0-9]{13}$/)) {
        const UserDetail = Parse.Object.extend('UserDetail');
        const userdetailQuery = new Parse.Query(UserDetail);
        userdetailQuery.equalTo('idcard', username);
        userdetail = await userdetailQuery.first();
        if (userdetail) {
          newUsername = userdetail.get('user').username;
        }
      }

      const user = await Parse.User.logIn(newUsername, password);

      const { isRegisteredDevice } = getState().device;
      if (isRegisteredDevice) {
        // installation update user id
        updateInstallation({
          badge: 0,
          user: user.get('userid'),
        });
      }

      // Queries user detail
      if (typeof userdetail === 'undefined') {
        const UserDetail = Parse.Object.extend('UserDetail');
        const userdetailQuery = new Parse.Query(UserDetail);
        userdetailQuery.equalTo('userid', user.get('userid'));
        userdetail = await userdetailQuery.first();
      }

      const gender = userdetail.get('gender').toLowerCase();
      // Set storage
      await AsyncStorage.setItem(
        '@USER',
        JSON.stringify({
          firstName: userdetail.get('firstname'),
          lastName: userdetail.get('surname'),
          gender,
          dob: userdetail.get('dob'),
        }),
      );

      let appAnalytic = JSON.stringify({});
      if (userdetail.get('appAnalytic')) {
        appAnalytic = userdetail.get('appAnalytic');
      }

      await AsyncStorage.setItem('AppUsage', appAnalytic);
      const isToFactorConfirmed =
        (await AsyncStorage.getItem('@AUTHENTICATION_TWO_FACTOR_CONFIRMED')) ===
        'SUCCESS';

      dispatch(
        loginSuccess({
          objectId: user.id,
          firstLogin: true,
          id: user.get('userid'),
          token: user.get('sessionToken'),
          username: user.get('username'),
          avatar: `${MHW_HOST}/files/avatar_120/${user.get('avatar')}`,
          firstName: userdetail.get('firstname'),
          lastName: userdetail.get('surname'),
          gender,
          dob: userdetail.get('dob'),
          age: moment().diff(userdetail.get('dob'), 'years'),
          isToFactorConfirmed,
        }),
      );

      dispatch(NavigationActions.navigate({ routeName: 'Home' }));
    } catch (error) {
      await Parse.User.logOut();
      dispatch(loginFailure(error.message));
    }

    // turn off spinner
    return dispatch(decrementProgress());
  };
}

// Log User Out
export function logUserOut() {
  return async (dispatch, getState) => {
    try {
      // clear the error box if it's displayed
      dispatch(clearError());

      // turn on spinner
      dispatch(incrementProgress());

      const appUsage = await AsyncStorage.getItem('AppUsage');
      const currentUser = await Parse.User.currentAsync();
      const UserDetail = Parse.Object.extend('UserDetail');
      const userDetailQuery = new Parse.Query(UserDetail);
      userDetailQuery.equalTo('userid', currentUser.get('userid'));
      const userDetail = await userDetailQuery.first();
      if (userDetail) {
        userDetail.set('appAnalytic', appUsage);
        userDetail.save();
      }

      // parse logout user
      await Parse.User.logOut();

      // set storage
      AsyncStorage.removeItem('@USER');
      AsyncStorage.removeItem('AppUsage');
      AsyncStorage.setItem('@AUTHENTICATION_TWO_FACTOR_CONFIRMED', 'FAILURE');

      const { isRegisteredDevice } = getState().device;
      if (isRegisteredDevice) {
        // clear user installation
        updateInstallation({
          badge: 0,
          user: null,
        });
      }

      dispatch(logoutSuccess());
    } catch (error) {
      dispatch(logoutFailure(new Error(error)));
    }

    dispatch(decrementProgress());
    return dispatch(NavigationActions.navigate({ routeName: 'Loading' }));
  };
}

export function createHash(username) {
  return async (dispatch) => {
    // clear the error box if it's displayed
    dispatch(clearError());

    // turn on spinner
    dispatch(incrementProgress());

    try {
      const query = new Parse.Query('_User');
      query.equalTo('username', username);
      const user = await query.first();
      if (!user) {
        throw new Error('No this user');
      }

      const uDetailQuery = new Parse.Query('UserDetail');
      uDetailQuery.equalTo('userid', user.get('userid'));
      const uDetail = await uDetailQuery.first();
      if (!uDetail) {
        throw new Error(`user ${user.id} not exisit data UserDetail`);
      }

      if (!uDetail.get('tel')) {
        throw new Error(`user ${username} phone number none`);
      }

      sendOTP(uDetail.get('tel'));

      dispatch(change('authResetPassword', 'userid', user.get('userid')));
      dispatch(change('authResetPassword', 'phone', uDetail.get('tel')));
      dispatch(passwordResetHashCreated());
      // turn off spinner
      dispatch(decrementProgress());
      return dispatch(NavigationActions.navigate({ routeName: 'VerifyCode' }));
    } catch (error) {
      dispatch(passwordResetHashFailure(error.message));
      // turn off spinner
      return dispatch(decrementProgress());
    }
  };
}

export function lastFetchUser() {
  return async (dispatch) => {
    try {
      const currentUser = await Parse.User.currentAsync();
      const fetchCurrentUser = await currentUser.fetch();
      const userDetailObject = Parse.Object.extend('UserDetail');
      const userDetailQuery = new Parse.Query(userDetailObject);
      userDetailQuery.equalTo('userid', fetchCurrentUser.get('userid'));
      const userDetail = await userDetailQuery.first();

      const gender = userDetail.get('gender').toLowerCase();

      await AsyncStorage.setItem(
        '@USER',
        JSON.stringify({
          firstName: userDetail.get('firstname'),
          lastName: userDetail.get('surname'),
          dob: userDetail.get('dob'),
          gender,
        }),
      );

      return dispatch(
        lastFetchedSuccess({
          username: fetchCurrentUser.get('username'),
          avatar: `${MHW_HOST}/files/avatar_120/${fetchCurrentUser.get(
            'avatar',
          )}`,
          firstName: userDetail.get('firstname'),
          lastName: userDetail.get('surname'),
          dob: userDetail.get('dob'),
          gender,
        }),
      );
    } catch (error) {
      return dispatch(lastFetchedFailure(error.message));
    }
  };
}
