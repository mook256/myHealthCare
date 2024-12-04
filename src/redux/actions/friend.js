import Parse from 'parse/react-native';
import { decrementProgress, incrementProgress } from './progress';

export const friendFetchSuccess = json => ({ type: 'FRIEND_FETCH_SUCCESS', json });
export const friendFetchFailure = error => ({ type: 'FRIEND_FETCH_FAILURE', error });

export const friendReceiveStatus = (userId, json) => ({
  type: 'FRIEND_RECEIVE_STATUS',
  userId,
  json,
});

export function friendFetch() {
  return async (dispatch) => {
    try {
      dispatch(incrementProgress());

      const currentUser = await Parse.User.currentAsync();
      const UserDetailObject = Parse.Object.extend('UserDetail');
      const userDetailQuery = new Parse.Query(UserDetailObject);
      userDetailQuery.equalTo('userid', currentUser.get('userid'));
      const userDetail = await userDetailQuery.first();
      if (userDetail) {
        if (userDetail.get('friend').length > 0) {
          const friendQuery = new Parse.Query(UserDetailObject);
          friendQuery.containedIn('userid', userDetail.get('friend'));
          const friend = await friendQuery.find();
          const newFriend = friend.map((o) => {
            const object = {};
            const user = o.get('user');
            if (user) {
              object.username = user.username || object.username;
              object.avatar = user.avatar || object.avatar;
            }
            return {
              id: o.get('userid'),
              username: object.username || 'No Username',
              avatar: object.avatar || 'default.png',
              fullname: `${o.get('firstname')} ${o.get('surname')}`,
              postopt: user,
            };
          });

          dispatch(friendFetchSuccess(newFriend));
        }
      }
    } catch (error) {
      dispatch(friendFetchFailure(error.massage));
    }

    return dispatch(decrementProgress());
  };
}
