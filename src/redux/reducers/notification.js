const initialState = {
  badge: 0,
  pending: false,
  items: [],
  isError: false,
  error: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'NOTIFICATION_DEVICE_REGISTERED_SUCCESS':
    case 'NOTIFICATION_INSTALLATION_FETCH_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.badge = action.json.badge;
      return newState;
    }
    case 'NOTIFICATION_RECEIVED': {
      const newState = Object.assign({}, state);
      newState.badge = action.json.badge;
      if (action.json.data) {
        newState.items = [action.json.data, ...newState.items];
      }
      return newState;
    }
    case 'NOTIFICATION_DEVICE_REGISTERED_FAILURE': {
      const newState = Object.assign({}, initialState);
      return newState;
    }
    case 'NOTIFICATION_BADGE_RESET_PENDING': {
      const newState = Object.assign({}, state);
      newState.badge = 0;
      return newState;
    }
    case 'NOTIFICATION_BADGE_RESET_SUCCESS':
    case 'NOTIFICATION_BADGE_RESET_FAILURE': {
      const newState = Object.assign({}, state);
      return newState;
    }
    case 'NOTIFICATION_PENDING': {
      const newState = Object.assign({}, state);
      newState.pending = true;
      newState.isError = false;
      newState.error = null;
      return newState;
    }
    case 'NOTIFICATION_FETCH_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.pending = false;
      newState.items = action.json;
      return newState;
    }
    case 'NOTIFICATION_FETCH_FAILURE': {
      const newState = Object.assign({}, state);
      newState.pending = false;
      newState.isError = true;
      newState.error = action.error;
      return newState;
    }
    default: {
      return state;
    }
  }
}
