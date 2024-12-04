const initialState = {
  deviceToken: '',
  installationId: '',
  isRegisteredDevice: false,
  isNetWorkConnected: true,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'NOTIFICATION_DEVICE_REGISTERED_SUCCESS':
    case 'NOTIFICATION_INSTALLATION_FETCH_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.deviceToken = action.json.deviceToken;
      newState.installationId = action.json.installationId;
      newState.isRegisteredDevice = true;
      return newState;
    }
    case 'DIVICE_NETWORK_CONNECTIVITY_CHANGE': {
      const newState = Object.assign({}, state);
      newState.isNetWorkConnected = action.json;
      return newState;
    }
    default: {
      return state;
    }
  }
}
