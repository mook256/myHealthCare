import { NavigationActions, StackActions } from 'react-navigation';
import _ from 'lodash';
import { CHAT_URL, CHAT_URL_IMAGE, CHAT_API_KEY } from '../../utils/constants';

export const conversationPending = () => ({
  type: 'CONVERSATION_PENDING',
});

export const conversationErrorClear = () => ({
  type: 'CONVERSATION_ERROR_CLEAR',
});

export const conversationFetchSuccess = json => ({
  type: 'CONVERSATION_FETCH_SUCCESS',
  json,
});
export const conversationFetchFailure = error => ({
  type: 'CONVERSATION_FETCH_FAILURE',
  error,
});

export const conversationAddSuccess = json => ({
  type: 'CONVERSATION_ADD_SUCCESS',
  json,
});
export const conversationAddFailure = error => ({
  type: 'CONVERSATION_ADD_FAILURE',
  error,
});

export const conversationDeleteSuccess = json => ({
  type: 'CONVERSATION_DELETE_SUCCESS',
  json,
});
export const conversationDeleteFailure = error => ({
  type: 'CONVERSATION_DELETE_FAILURE',
  error,
});

export const conversationNavigateMessageSuccess = json => ({
  type: 'CONVERSATION_NAVIGATE_MESSAGE_SUCCESS',
  json,
});

export const conversationNavigateMessageFailure = json => ({
  type: 'CONVERSATION_NAVIGATE_MESSAGE_FAILURE',
  json,
});

export const conversationMessagePending = () => ({
  type: 'CONVERSATION_MESSAGE_PENDING',
});

export const conversationMessageFetchSuccess = (conversationId, page, json) => ({
  type: 'CONVERSATION_MESSAGE_FETCH_SUCCESS',
  conversationId,
  page,
  json,
});
export const conversationMessageFetchFailure = error => ({
  type: 'CONVERSATION_MESSAGE_FETCH_FAILURE',
  error,
});

export const conversationMessageClear = () => ({
  type: 'CONVERSATION_MESSAGE_CLEAR',
});

export const conversationMessageAddSuccess = (conversationId, json) => ({
  type: 'CONVERSATION_MESSAGE_ADD_SUCCESS',
  conversationId,
  json,
});
export const conversationMessageAddFailure = error => ({
  type: 'CONVERSATION_MESSAGE_ADD_FAILURE',
  error,
});

export const conversationReceivedMessageCreatedSuccess = (on, json) => ({
  type: `CONVERSATION_RECEIVED_MESSAGE_CREATED_SUCCESS/${on}`,
  json,
});

export const conversationReceivedMessageCreateFailure = error => ({
  type: 'CONVERSATION_RECEIVED_MESSAGE_CREATED_FAILURE',
  error,
});

// TODO: load more data conversation
export function fetchConversation() {
  return async (dispatch, getState) => {
    try {
      dispatch(conversationPending());

      const { authentication } = getState();
      const response = await fetch(`${CHAT_URL}/me/conversation/`, {
        headers: {
          'X-Api-key': CHAT_API_KEY,
          Authorization: authentication.token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('request failure');
      }

      const json = await response.json();
      dispatch(conversationFetchSuccess(json));
    } catch (error) {
      dispatch(conversationFetchFailure(error));
    }
  };
}

export function addConversation(participant) {
  return async (dispatch, getState) => {
    try {
      dispatch(conversationPending());

      const { authentication } = getState();

      // validate chat with myself
      if (participant.userid === authentication.id) {
        throw new Error('can not chat with myself');
      }

      // send to api create conversation
      const conversation = await fetch(`${CHAT_URL}/me/conversation/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-key': CHAT_API_KEY,
          Authorization: authentication.token,
        },
        body: JSON.stringify({
          participant: participant.userid,
        }),
      }).then(async (response) => {
        if (response.status === 400) {
          const { error } = await response.json();
          if (typeof error.participant !== 'undefined') {
            throw new Error(error.participant.message);
          }

          if (typeof error.message !== 'undefined') {
            throw new Error(error.message);
          }
        }

        if (!response.ok) {
          throw new Error('request failure');
        }

        return response.json();
      });

      // dispatch add a new conversation
      dispatch(conversationAddSuccess(conversation));

      // navigate to message screen
      return dispatch(
        StackActions.replace({
          routeName: 'Message',
          params: conversation,
        }),
      );
    } catch (error) {
      return dispatch(conversationAddFailure(error));
    }
  };
}

// TODO add cone delete conversation
export function deleteConversation(id) {
  return async (dispatch, getState) => {
    try {
      dispatch(conversationPending());

      const { authentication } = getState();

      const conversation = await fetch(`${CHAT_URL}/me/conversation/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-key': CHAT_API_KEY,
          Authorization: authentication.token,
        },
      }).then((response) => {
        if (!response.ok) {
          throw new Error('request failure');
        }

        return response.json();
      });

      return dispatch(conversationDeleteSuccess(conversation));
    } catch (error) {
      return dispatch(conversationDeleteFailure(error));
    }
  };
}

export function goToMessage(participant) {
  return async (dispatch, getState) => {
    const { conversation, authentication } = getState();
    try {
      // clean error conversation
      dispatch(conversationErrorClear());

      // case 1 find conversation in state
      const conversationState = conversation.items.find(
        o => o.participants.userid === participant.userid,
      );

      // if there is conversation state then redirect to message screen
      if (typeof conversationState !== 'undefined') {
        //  navigate to message screen
        return dispatch(
          NavigationActions.navigate({
            routeName: 'Message',
            params: conversationState,
          }),
        );
      }

      // case 2 find conversations
      // encode json to query string
      const queryString = encodeURIComponent(
        JSON.stringify({
          participants: {
            $inQuery: {
              where: { userid: participant.userid },
              className: 'UserDetail',
            },
          },
        }),
      );

      // request get conversation
      const conversationFind = await fetch(`${CHAT_URL}/me/conversation?where=${queryString}`, {
        headers: {
          'X-Api-key': CHAT_API_KEY,
          Authorization: authentication.token,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('request failure');
          }
          return response.json();
        })
        .then((response) => {
          if (!response.length) {
            return undefined;
          }

          return response[0];
        });

      if (typeof conversationFind !== 'undefined') {
        // dispatch add a new conversation
        dispatch(conversationNavigateMessageSuccess(conversationFind));

        // navigate to message screen
        return dispatch(
          NavigationActions.navigate({
            routeName: 'Message',
            params: conversationFind,
          }),
        );
      }

      // case 3 add new a conversation
      // create a successful conversation and then redirect to the message screen.
      // validate chat with myself
      if (participant.userid === authentication.id) {
        throw new Error('can not chat with myself');
      }

      // send to api create conversation
      const conversationCreated = await fetch(`${CHAT_URL}/me/conversation/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-key': CHAT_API_KEY,
          Authorization: authentication.token,
        },
        body: JSON.stringify({
          participant: participant.userid,
        }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error('request failure');
        }

        return response.json();
      });

      // dispatch add a new conversation
      dispatch(conversationNavigateMessageSuccess(conversationCreated));

      // navigate to message screen
      return dispatch(
        NavigationActions.navigate({
          routeName: 'Message',
          params: conversationCreated,
        }),
      );
    } catch (error) {
      return dispatch(conversationNavigateMessageFailure(error));
    }
  };
}

export function fetchMessages(convId, page = 1) {
  return async (dispatch, getState) => {
    try {
      dispatch(conversationMessagePending());

      const { authentication } = getState();
      const limit = 30;
      // TODO fetch object unique message
      const response = await fetch(
        `${CHAT_URL}/me/conversation/${convId}/messages?page=${page}&limit=${limit}`,
        {
          headers: {
            'X-Api-key': CHAT_API_KEY,
            Authorization: authentication.token,
          },
        },
      );
      if (!response.ok) {
        throw new Error('request failure');
      }

      const json = await response.json();

      return dispatch(conversationMessageFetchSuccess(convId, page, json));
    } catch (error) {
      return dispatch(conversationMessageFetchFailure(error));
    }
  };
}

export function addMessage(conversationId, object = {}) {
  return async (dispatch, getState) => {
    // if parameter object empty then return
    if (_.isEmpty(object)) return undefined;

    dispatch(conversationMessagePending());

    const { message, authentication } = getState();

    const payload = { message: {} };

    // message image
    if (!_.isEmpty(object.image)) {
      try {
        // Request to upload file
        const formdata = new FormData();
        formdata.append('file', object.image);

        const upload = await fetch(`${CHAT_URL}/files`, {
          method: 'POST',
          headers: {
            'X-Api-key': CHAT_API_KEY,
            Authorization: authentication.token,
          },
          body: formdata,
        }).then((response) => {
          if (!response.ok) {
            throw new Error('request failure');
          }

          return response.json();
        });

        payload.message.image = upload.filename;
      } catch (error) {
        return dispatch(conversationMessageAddFailure(error));
      }
    }

    // message text
    if (!_.isEmpty(object.text)) {
      payload.message.text = object.text;
    }

    try {
      /* const savedMessage =  */ await fetch(
        `${CHAT_URL}/me/conversation/${message.conversationId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-key': CHAT_API_KEY,
            Authorization: authentication.token,
          },
          body: JSON.stringify(payload),
        },
      ).then((response) => {
        if (!response.ok) {
          throw new Error('request failure');
        }

        return response.json();
      });

      // TODO dispatch add message
      // const json = await savedMessage.json();
      // return dispatch(
      //   conversationMessageAddSuccess({
      //     _k: param._k,
      //     ...json,
      //   }),
      // );
      return undefined;
    } catch (error) {
      // remove image when saved message error
      fetch(`${CHAT_URL}/files/${payload.message.image}`, {
        method: 'DELETE',
        headers: {
          'X-Api-key': CHAT_API_KEY,
          Authorization: authentication.token,
        },
      });

      return dispatch(conversationMessageAddFailure(error));
    }
  };
}

export function receivedMessageCreated(object) {
  return async (dispatch, getState) => {
    try {
      dispatch(conversationErrorClear());

      const { conversation, authentication } = getState();

      const indexConversationState = conversation.items.findIndex(
        o => o.objectId === object.conversation.objectId,
      );

      // Dispatch add new a message
      // check the conversation is exists
      if (indexConversationState !== -1) {
        const message = _.pick(object, [
          'conversation.objectId',
          'author.userid',
          'author.user.username',
          'author.user.avatar',
          'text',
          'image',
          'isReaded',
          'objectId',
          'createdAt',
          'updatedAt',
        ]);

        if (!_.isEmpty(message.image)) {
          message.image = `${CHAT_URL_IMAGE}/${message.image}`;
        }

        return dispatch(conversationReceivedMessageCreatedSuccess('ADD_MESSAGE', message));
      }

      // Dispatch add new a conversation state
      const getConversation = await fetch(
        `${CHAT_URL}/me/conversation/${object.conversation.objectId}`,
        {
          headers: {
            'X-Api-key': CHAT_API_KEY,
            Authorization: authentication.token,
          },
        },
      ).then((response) => {
        if (!response.ok) {
          throw new Error('request failure');
        }
        return response.json();
      });

      return dispatch(
        conversationReceivedMessageCreatedSuccess('ADD_CONVERSATION', getConversation),
      );
    } catch (error) {
      // TODO Dispatch error
      return dispatch(conversationReceivedMessageCreateFailure(error));
    }
  };
}
