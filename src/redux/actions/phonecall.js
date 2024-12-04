import { Platform } from 'react-native';
import RNCallKeep from 'react-native-callkeep';
import BackgroundTimer from 'react-native-background-timer';
import RestartTimer from '../../RestartTimer';
import { NavigationActions } from 'react-navigation';

import _ from 'lodash';

const isIOS = Platform.OS === 'ios';

export const addPhoneCall = (uuid, data) => ({
  type: 'PHONE_CALL_ADD',
  uuid,
  data,
});

export const removePhoneCall = (uuid) => ({ type: 'PHONE_CALL_REMOVE', uuid });

export function endCall(uuid) {
  return async (dispatch) => {
    dispatch(removePhoneCall(uuid));
    // RNCallKeep.endCall(uuid);
  };
}

// export function incomingCall(uuid, { channelName, participantName }) {
//   return async (dispatch, getState) => {
//     const { phonecall, videocall } = getState();
//     console.log('VideoCall start', phonecall);
//     console.log('VideoCall start', videocall);
//     if (_.size(phonecall.calls) === 0 && _.size(videocall.calls) === 0) {
//       RestartTimer.stop();
//       // if (isIOS) {
//       //   BackgroundTimer.start();
//       // }
//       const timeoutId = BackgroundTimer.setTimeout(() => {
//         RNCallKeep.rejectCall(uuid);
//       }, 90 * 1000);
//       if (isIOS) {
//         BackgroundTimer.stop();
//       }

//       dispatch(
//         addPhoneCall(uuid, {
//           callType: 'incoming',
//           participantName,
//           channelName,
//           timeoutId,
//         }),
//       );

//       console.log('VideoCall dispatch');

//       dispatch(
//         NavigationActions.navigate({
//           routeName: 'VideoCall',
//           params: {
//             channelName: channelName,
//             callType: 'incoming',
//             // callUUID: 'f0798b0f-8c07-49a8-afe0-40af6436a7c1',
//             // callType: 'outgoing',
//           },
//         }),
//       );

//       // dispatch(
//       //   NavigationActions.navigate({
//       //     routeName: 'VideoCall',
//       //     params: {
//       //       channelName: channelName,
//       //       participants: participantName,
//       //       callUUID: 'f0798b0f-8c07-49a8-afe0-40af6436a7c1',
//       //       callType: 'outgoing',
//       //     },
//       //   }),
//       // );

//       // const name = `MHF telemed: ${participantName}`;
//       // RNCallKeep.displayIncomingCall(uuid, name, name, 'generic', true);
//     }
//   };
// }

export function incomingCall(uuid, { channelName, participantName }) {
  return async (dispatch, getState) => {
    const { phonecall, videocall } = getState();
      RestartTimer.stop();
      // if (isIOS) {
      //   BackgroundTimer.start();
      // }
      const timeoutId = BackgroundTimer.setTimeout(() => {
        RNCallKeep.rejectCall(uuid);
      }, 90 * 1000);
      if (isIOS) {
        BackgroundTimer.stop();
      }

      dispatch(
        addPhoneCall(uuid, {
          callType: 'incoming',
          participantName,
          channelName,
          timeoutId,
        }),
      );

      console.log('VideoCall dispatch');

      dispatch(
        NavigationActions.navigate({
          routeName: 'VideoCall',
          params: {
            channelName: channelName,
            callType: 'incoming',
            // callUUID: 'f0798b0f-8c07-49a8-afe0-40af6436a7c1',
            // callType: 'outgoing',
          },
        }),
      );
  };
}