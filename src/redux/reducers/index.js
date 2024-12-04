/* eslint-disable */
/* eslint-disable no-param-reassign */
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import AuthenticationReducer from './authentication';
import ErrorReducer from './error';
import ProgressReducer from './progress';
import NavReducer from './nav';
import NotificationReducer from './notification';
import UserReducer from './user';
import DeviceReducer from './device';
import FriendReducer from './friend';
import ConversationReducer from './conversation';
import MessageReducer from './message';
import PhoneCallReducer from './phonecall';
import VideoCallReducer from './videocall';
import CurrentUserReducer from './currentuser';
import HealthDataReducer from './healthdata';
import ConfigReducer from './config';
import BleReducer from './ble';
import SOSReducer from './sos';
import StaffReducer from './staff';

const reducers = {
  error: ErrorReducer,
  nav: NavReducer,
  form: formReducer,
  authentication: AuthenticationReducer,
  user: UserReducer,
  notification: NotificationReducer,
  progress: ProgressReducer,
  conversation: ConversationReducer,
  message: MessageReducer,
  device: DeviceReducer,
  friend: FriendReducer,
  phonecall: PhoneCallReducer,
  videocall: VideoCallReducer,
  currentuser: CurrentUserReducer,
  healthdata: HealthDataReducer,
  config: ConfigReducer,
  ble: BleReducer,
  sos: SOSReducer,
  staff: StaffReducer,
};

const appReducer = combineReducers(reducers);

const rootReducer = (state, action) => {
  if (action.type === 'AUTHENTICATION_LOGOUT_SUCCESS') {
    const { nav, device } = state;
    state = { nav, device };
  }

  return appReducer(state, action);
};

export default rootReducer;
