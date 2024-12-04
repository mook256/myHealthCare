import {
  SET_DEVICE_KEY,
  SET_CONFIG,
  SET_USERS,
  SET_DEVICE_NAME,
  SET_AUTH,
  RESET_ERROR,
  FETCH_CONFIG_ATTEMPT,
  FETCH_CONFIG_SUCCESS,
  FETCH_CONFIG_FAILURE,
  REGISTER_CONFIG_ATTEMPT,
  REGISTER_CONFIG_SUCCESS,
  REGISTER_CONFIG_FAILURE,
} from '../actions/config';

const initialState = {
  deviceKey: null,
  loading: false,
  error: null,
  deviceName: null,
  users: null, // [{userid: string, username: string, avatar: url}]
  auth: null, // { username: string, password: string }
  config: {
    partner: null, // {partnerid: string, emergencyNurseId: string}
    images: null, // {homePage: url, mainPage1: url, mainPage2, url, camera: url}
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_DEVICE_KEY: {
      return { ...state, deviceKey: action.payload };
    }
    case SET_CONFIG: {
      return { ...state, config: action.payload };
    }
    case SET_AUTH: {
      return { ...state, auth: action.payload };
    }
    case SET_DEVICE_NAME: {
      return { ...state, deviceName: action.payload };
    }
    case SET_USERS: {
      return { ...state, users: action.payload };
    }
    case RESET_ERROR: {
      return { ...state, loading: false, error: null };
    }
    case FETCH_CONFIG_ATTEMPT: {
      return {
        ...state,
        loading: true,
        error: null,
        users: initialState.users,
        config: initialState.config,
      };
    }
    case FETCH_CONFIG_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null,
        deviceName: action.payload.name,
        users: action.payload.users,
        config: action.payload.config,
      };
    }
    case FETCH_CONFIG_FAILURE: {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }
    case REGISTER_CONFIG_ATTEMPT: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case REGISTER_CONFIG_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null,
      };
    }
    case REGISTER_CONFIG_FAILURE: {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}
