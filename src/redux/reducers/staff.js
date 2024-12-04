const initialState = {
  citizen_id: 0,
  fullname: '',
  is_logged_in: false,
  avatar: 'defaultx.png',
  fullname_en: '',
  fullname_th: '',
  username: '',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'STAFF_LOGIN_FAILURE': {
      const newState = Object.assign({}, state);
      newState.staffdetail = initialState;
      return newState;
    }
    case 'UPDATE_LOGIN_INFO': {
      const newState = Object.assign({}, state);
      newState.staffdetail = action.json;
      return newState;
    }
    default: {
      return state;
    }
  }
}
