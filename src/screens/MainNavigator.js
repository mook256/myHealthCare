import React, { Component } from 'react';
import { connect } from 'react-redux';
import Parse from 'parse/react-native';

import Navigator from '../navigators/main';
import { CHAT_LIVE_QUERY } from '../utils/constants';
import { receivedMessageCreated } from '../redux/actions/conversation';
import { friendReceiveStatus } from '../redux/actions/friend';
import { userLookup } from '../redux/actions/users';

const { LiveQueryClient } = Parse;

export class MainNavigator extends Component {
  static router = {
    ...Navigator.router,
    getStateForAction: (action, lastState) =>
      Navigator.router.getStateForAction(action, lastState),
  };

  constructor(props) {
    super(props);

    this._client = undefined;
    this._subscribe = this._subscribe.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(userLookup());
    // this._subscribe();
  }

  componentWillUnmount() {
    // this._client.close();
  }

  // Connect to LiveQueryServe and subscribe a ParseQuery
  async _subscribe() {
    const currentUser = await Parse.User.currentAsync();
    const sessionToken = currentUser.get('sessionToken');

    this._client = new LiveQueryClient({
      sessionToken,
      ...CHAT_LIVE_QUERY,
    });
    this._client.open();

    this.messageSubscribe(sessionToken);
    this.messageUserStatus(sessionToken);
  }

  // Subscription Message
  messageSubscribe(sessionToken) {
    const { dispatch } = this.props;
    const query = new Parse.Query('Message');
    query.include(['conversation', 'author']);
    const subscription = this._client.subscribe(query, sessionToken);

    subscription.on('create', async (object) => {
      await object.get('author').fetch();
      const newObject = object.toJSON();
      dispatch(receivedMessageCreated(newObject));
    });
  }

  messageUserStatus(sessionToken) {
    const { dispatch } = this.props;

    const query = new Parse.Query('UserStatus');
    const subscription = this._client.subscribe(query, sessionToken);

    subscription.on('create', async (object) => {
      dispatch(
        friendReceiveStatus(object.get('userid'), {
          objectId: object.id,
          status: object.get('status'),
          createdAt: object.createdAt,
          updatedAt: object.updatedAt,
        }),
      );
    });

    subscription.on('update', async (object) => {
      dispatch(
        friendReceiveStatus(object.get('userid'), {
          objectId: object.id,
          status: object.get('status'),
          createdAt: object.createdAt,
          updatedAt: object.updatedAt,
        }),
      );
    });

    subscription.on('delete', async (object) => {
      dispatch(
        friendReceiveStatus(object.get('userid'), {
          objectId: object.id,
          status: object.get('status'),
          createdAt: object.createdAt,
          updatedAt: object.updatedAt,
        }),
      );
    });
  }

  render() {
    const { navigation } = this.props;
    // console.log('navigation',navigation.state.routeName);
    return <Navigator navigation={navigation} />;
  }
}

// MainNavigator.propTypes = {
//   authentication: PropTypes.object.isRequired,
// };

// const mapStateToProps = state => ({
//   authentication: state.authentication,
// });

export default connect(null)(MainNavigator);
