const initialState = {
  calls: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'VIDEO_CALL_ADD': {
      const newCalls = { ...state.calls, [action.uuid]: action.data };
      return { ...state, calls: newCalls };
    }
    case 'VIDEO_CALL_REMOVE': {
      // eslint-disable-next-line no-unused-vars
      const { [action.uuid]: _, ...newCalls } = state.calls;
      return { ...state, calls: newCalls };
    }
    default:
      return state;
  }
}
