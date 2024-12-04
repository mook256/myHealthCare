import _ from 'lodash';
import Chat from '../../services/Chat';

const initialState = {
  pending: false,
  conversationId: '',
  items: [],
  isError: false,
  error: null,
  isCreatedSuccess: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'CONVERSATION_MESSAGE_PENDING': {
      const newState = Object.assign({}, state);
      newState.pending = true;
      newState.isError = false;
      newState.error = null;
      return newState;
    }
    case 'CONVERSATION_MESSAGE_FETCH_FAILURE':
    case 'CONVERSATION_MESSAGE_ADD_FAILURE': {
      const newState = Object.assign({}, state);
      newState.pending = false;
      newState.isError = true;
      newState.error = action.error;
      return newState;
    }
    case 'CONVERSATION_RECEIVED_MESSAGE_CREATED_FAILURE': {
      const newState = Object.assign({}, state);
      newState.isError = true;
      newState.error = action.error;
      return newState;
    }
    case 'CONVERSATION_MESSAGE_FETCH_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.conversationId = action.conversationId;
      if (action.page !== 1) {
        const items = [...newState.items, ...Chat.messages(action.json)];
        newState.items = _.uniqBy(items, '_id');
      } else {
        newState.items = Chat.messages(action.json);
      }
      newState.pending = false;
      return newState;
    }
    case 'CONVERSATION_MESSAGE_CLEAR': {
      const newState = Object.assign({}, initialState);
      return newState;
    }
    case 'CONVERSATION_RECEIVED_MESSAGE_CREATED_SUCCESS/ADD_MESSAGE': {
      if (state.conversationId === '') {
        return state;
      }

      const newState = Object.assign({}, state);
      if (state.conversationId !== '') {
        const payload = _.omit(action.json, ['conversation']);
        const message = Chat.message(payload);
        newState.items = _.uniqBy([message, ...state.items], '_id');
      }
      return newState;
    }
    default: {
      return state;
    }
  }
}
