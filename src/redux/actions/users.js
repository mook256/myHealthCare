import Parse from 'parse/react-native';
import moment from 'moment';

import { decrementProgress, incrementProgress } from './progress';

export const userLookupFailure = (error) => ({
  type: 'USER_LOOKUP_FAILURE',
  error,
});
export const userLookupSuccess = (json) => ({
  type: 'USER_LOOKUP_SUCCESS',
  json,
});

// Look up a user
export function userLookup() {
  return async (dispatch) => {
    try {
      // turn on spinner
      dispatch(incrementProgress());

      const currentUser = await Parse.User.currentAsync();

      // Queries UserDetail
      const UserDetail = Parse.Object.extend('UserDetail');
      const userDetailQuery = new Parse.Query(UserDetail);
      userDetailQuery.equalTo('userid', currentUser.get('userid'));
      const userDetail = await userDetailQuery.first();

      // Queries userPoint
      const userPointObject = Parse.Object.extend('UserPoint');
      const userPointQuery = new Parse.Query(userPointObject);
      userPointQuery.equalTo('userid', currentUser.get('userid'));
      const userPoint = await userPointQuery.first().catch(() => 0);
      let mCoin = 0;
      let age = 1;
      let bmr = 2000;
      if (userPoint && userPoint.get('point')) {
        mCoin = userPoint.get('point');
      }
      if (userDetail.get('dob')) {
        age = moment().diff(userDetail.get('dob'), 'years');
      }
      const healthdata = userDetail.get('healthdata');
      const rtdata = userDetail.get('rtDataLatestHistory');
      const gender = userDetail.get('gender') || 'Male';
      const hei = healthdata.hei1 || 160;
      const wei = healthdata.wei1 || 50;

      if (gender === 'Male' || gender === 'male') {
        bmr = 66 + 13.7 * wei + 5 * hei - 6.8 * age;
      } else {
        bmr = 665 + 9.6 * wei + 1.8 * hei - 4.7 * age;
      }

      dispatch(
        userLookupSuccess({
          patient: userDetail.get('phn') || [],
          userdetail: {
            age,
            gender: userDetail.get('gender'),
            healthdata,
            rtdata,
            bmr,
            appAnalytic: userDetail.get('appAnalytic'),
          },
          mCoin,
        }),
      );
    } catch (error) {
      dispatch(userLookupFailure(error.message));
    }

    return dispatch(decrementProgress());
  };
}
