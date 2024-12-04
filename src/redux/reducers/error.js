const initialState = {
  isError: false,
  message: '',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'AUTHENTICATION_LOGIN_FAILURE':
    case 'AUTHENTICATION_LOGOUT_FAILURE':
    case 'AUTHENTICATION_REGISTRATION_FAILURE':
    case 'AUTHENTICATION_MERGEFORM_REGISTRATION_FAILURE':
    case 'AUTHENTICATION_PASSWORD_RESET_HASH_FAILURE':
    case 'AUTHENTICATION_PASSWORD_SAVE_FAILURE':
    case 'AUTHENTICATION_LAST_FETCHED_FAILURE':
    case 'CHAT_HISTORY_FETCH_FAILURE':
    case 'NOTIFICATION_DEVICE_REGISTERED_FAILURE':
    case 'NOTIFICATION_BADGE_RESET_FAILURE':
    case 'HEALTH_FETCH_FAILURE':
    case 'POST_FETCH_FAILURE':
    case 'VISIT_FETCH_FAILURE':
    case 'USER_LOOKUP_FAILURE': {
      const newState = Object.assign({}, initialState);
      newState.isError = true;
      newState.message = action.error;
      return newState;
    }
    case 'ERROR_CLEARED': {
      const newState = Object.assign({}, initialState);
      return newState;
    }
    default: {
      return state;
    }
  }
}
