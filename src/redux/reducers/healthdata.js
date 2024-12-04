import {
  SET_RECORD,
  SAVE_RECORD_PROCESS,
  SAVE_RECORD_SUCCESS,
  SAVE_RECORD_FAIL,
  CLEAR_RECORD,
} from '../actions/healthdata';

const initialState = {
  record: {
    sbp: 0,
    dbp: 0,
    hr: 0,
    weight: 0.0,
    height: 0,
    temp: 0.0,
    spo2: 0,
    spo2before: 0,
    spo2after: 0,
    bgc: 0.0,
    resp: 0,
  },
  loading: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_RECORD: {
      return { ...state, record: { ...state.record, ...action.payload } };
    }
    case SAVE_RECORD_PROCESS: {
      return { ...state, loading: true };
    }
    case SAVE_RECORD_SUCCESS: {
      // return initialState;
      return { ...state, loading: false };
    }
    case SAVE_RECORD_FAIL: {
      return { ...state, loading: false };
    }
    case CLEAR_RECORD: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}
