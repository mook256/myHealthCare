const initialState = {
  objectId: '',
  id: '',
  username: '',
  firstName: '',
  lastName: '',
  gender: '',
  dob: '',
  age: '',
  token: '',
  avatar: '',
  point: 0,
  isLoggedIn: false,
  isLoggingIn: false,
  isToFactorConfirmed: false,
  isPasswordChanged: false,
  isPasswordReset: false,
  registrationSucceeded: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'AUTHENTICATION_LOGIN_ATTEMPT': {
      const newState = Object.assign({}, state);
      newState.isLoggingIn = true;
      return newState;
    }
    case 'AUTHENTICATION_LOGIN_FAILURE':
    case 'AUTHENTICATION_LOGOUT_SUCCESS': {
      const newState = Object.assign({}, initialState);
      return newState;
    }
    case 'AUTHENTICATION_LOGIN_SUCCESS':
    case 'AUTHENTICATION_TOKEN_CHECK_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.firstName = action.json.firstName;
      newState.id = action.json.id;
      newState.objectId = action.json.objectId;
      newState.isLoggedIn = true;
      newState.isLoggingIn = false;
      newState.point = 0;
      newState.lastName = action.json.lastName;
      newState.username = action.json.username;
      newState.gender = action.json.gender;
      newState.token = action.json.token;
      newState.avatar = action.json.avatar;
      newState.dob = action.json.dob;
      newState.age = action.json.age;
      return newState;
    }
    case 'AUTHENTICATION_LOGOUT_FAILURE':
    case 'AUTHENTICATION_MERGEFORM_REGISTRATION_FAILURE':
    case 'AUTHENTICATION_REGISTRATION_FAILURE': {
      return state;
    }
    case 'AUTHENTICATION_TWOFACTOR_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.isToFactorConfirmed = true;
      return newState;
    }
    case 'AUTHENTICATION_PASSWORD_RESET_CLEAR':
    case 'AUTHENTICATION_PASSWORD_RESET_HASH_FAILURE': {
      const newState = Object.assign({}, state);
      newState.isPasswordReset = false;
      return newState;
    }
    case 'AUTHENTICATION_PASSWORD_RESET_HASH_CREATED': {
      const newState = Object.assign({}, state);
      newState.isPasswordReset = true;
      return newState;
    }
    case 'AUTHENTICATION_PASSWORD_SAVE_CLEAR': {
      const newState = Object.assign({}, state);
      newState.isPasswordChanged = false;
      return newState;
    }
    case 'AUTHENTICATION_PASSWORD_SAVE_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.isPasswordChanged = true;
      return newState;
    }
    case 'AUTHENTICATION_REGISTRATION_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.registrationSucceeded = true;
      return newState;
    }
    case 'AUTHENTICATION_REGISTRATION_SUCCESS_VIEWED': {
      const newState = Object.assign({}, state);
      newState.registrationSucceeded = false;
      return newState;
    }
    case 'AUTHENTICATION_LAST_FETCHED_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.firstName = action.json.firstName;
      newState.lastName = action.json.lastName;
      newState.username = action.json.username;
      newState.gender = action.json.gender;
      newState.dob = action.json.dob;
      newState.avatar = action.json.avatar;
      return newState;
    }
    default: {
      return state;
    }
  }
}
