const initialState = {
  idcard: '',
  studentid: '',
  firstName: '',
  lastName: '',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_CURRENT_USER_SUCCESS': {
      return action.payload;
    }
    case 'CLEAR_CURRENT_USER': {
      return {};
    }
    default: {
      return state;
    }
  }
}
