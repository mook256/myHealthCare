/**
 * @flow
 */

import { MHW_HOST } from '../utils/constants';

export const body = ['text', 'image', 'video'];

type Message = {
  objectId: String,
  text: String,
  image: String,
  createdAt: Date,
  author: {
    userid: String,
    user: {
      username: String,
      avatar: String,
    },
  },
};

export default class Chat {
  /**
   * convert params to props messages in gifted chat
   * @param {Array} params messages of the conversation
   */
  static messages(params: Array = []) {
    return params.map(Chat.message);
  }

  /**
   * convert param to props messages in gifted chat
   * @param {Object} param message of the conversation
   */
  static message({ objectId, text, image, createdAt, author }: Message) {
    const result = {
      _id: objectId,
      text,
      image,
      user: {
        _id: author.userid,
        name: author.user.username,
        avatar: `${MHW_HOST}/files/avatar_120/${author.user.avatar}`,
      },
      createdAt,
    };

    return result;
  }

  static convertJsonParse() {}
}
