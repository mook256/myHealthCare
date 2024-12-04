import {
  SOS_SENDING,
  SOS_SEND_SUCCESS,
  SOS_SEND_FAILURE,
  SOS_CLEAR,
} from '../actions/sos';

const initialState = {
  status: null, // null, 'loading', 'success', 'error'
  error: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SOS_SENDING: {
      return { ...state, status: 'loading', error: null };
    }
    case SOS_SEND_SUCCESS: {
      return { ...state, status: 'success', error: null };
    }
    case SOS_SEND_FAILURE: {
      return { ...state, status: 'error', error: action.error };
    }
    case SOS_CLEAR: {
      return initialState;
    }
    default:
      return state;
  }
}
