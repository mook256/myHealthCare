const initialState = {
  pending: false,
  items: [],
  isError: false,
  error: null,
  isCreatedSuccess: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'CONVERSATION_PENDING': {
      const newState = Object.assign({}, state);
      newState.pending = true;
      newState.isCreatedSuccess = false;
      newState.isError = false;
      newState.error = null;
      return newState;
    }
    case 'CONVERSATION_ERROR_CLEAR': {
      const newState = Object.assign({}, state);
      newState.error = null;
      return newState;
    }
    case 'CONVERSATION_FETCH_FAILURE':
    case 'CONVERSATION_ADD_FAILURE':
    case 'CONVERSATION_DELETE_FAILURE': {
      const newState = Object.assign({}, state);
      newState.pending = false;
      newState.isError = true;
      newState.error = action.error;
      return newState;
    }
    case 'CONVERSATION_NAVIGATE_MESSAGE_FAILURE':
    case 'CONVERSATION_RECEIVED_MESSAGE_CREATED_FAILURE': {
      const newState = Object.assign({}, state);
      newState.isError = true;
      newState.error = action.error;
      return newState;
    }
    case 'CONVERSATION_FETCH_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.items = action.json.slice();
      newState.pending = false;
      return newState;
    }
    case 'CONVERSATION_ADD_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.items = [action.json, ...state.items];
      newState.pending = false;
      newState.isCreatedSuccess = true;
      return newState;
    }
    case 'CONVERSATION_DELETE_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.items = newState.items.filter(o => o.objectId !== action.json.objectId);
      return newState;
    }
    case 'CONVERSATION_MESSAGE_FETCH_SUCCESS': {
      if (action.page !== 1) {
        return state;
      }

      const newState = Object.assign({}, state);
      // add last a message
      const index = state.items.findIndex(o => o.objectId === action.conversationId);
      if (index !== -1) {
        newState.items[index].message = action.json[0];
      }
      return newState;
    }
    case 'CONVERSATION_RECEIVED_MESSAGE_CREATED_SUCCESS/ADD_CONVERSATION':
    case 'CONVERSATION_NAVIGATE_MESSAGE_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.items = [action.json, ...state.items];
      return newState;
    }
    case 'CONVERSATION_RECEIVED_MESSAGE_CREATED_SUCCESS/ADD_MESSAGE': {
      const { json } = action;
      const { conversation, ...message } = json;
      const index = state.items.findIndex(o => o.objectId === conversation.objectId);
      if (index === -1) {
        return state;
      }

      const newState = Object.assign({}, state);

      // item remove
      const item = {
        ...newState.items.splice(index, 1)[0],
        message,
      };

      // item insert
      newState.items.splice(0, 0, item);
      return newState;
    }
    case 'FRIEND_RECEIVE_STATUS': {
      const index = state.items.findIndex(
        ({ participants }) => participants.userid === action.userId,
      );
      if (index === -1) {
        return state;
      }

      const item = state.items[index];

      const newState = Object.assign({}, state);
      newState.items[index].participants = {
        ...item.participants,
        userStatus: action.json,
      };
      return newState;
    }
    default: {
      return state;
    }
  }
}
