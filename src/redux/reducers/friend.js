const initialState = [];

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'FRIEND_FETCH_SUCCESS': {
      const newState = action.json.slice();
      return newState;
    }
    case 'FRIEND_FETCH_FAILURE': {
      const newState = initialState.slice();
      return newState;
    }
    default: {
      return state;
    }
  }
}
