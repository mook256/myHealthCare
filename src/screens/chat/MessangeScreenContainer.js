import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MessangeScreen from './MessangeScreen';
import { fetchMessages, addMessage, conversationMessageClear } from '../../redux/actions/conversation';

export class MessangeScreenContainer extends PureComponent {
  render() {
    const {
      navigation,
      message,
      authentication,
      fetchMessagesFunction,
      addMessageFunction,
      conversationMessageClearFunction,
    } = this.props;

    return (
      <MessangeScreen
        message={message}
        authentication={authentication}
        navigation={navigation}
        fetchMessagesFunction={fetchMessagesFunction}
        addMessageFunction={addMessageFunction}
        conversationMessageClearFunction={conversationMessageClearFunction}
      />
    );
  }
}

MessangeScreenContainer.propTypes = {
  authentication: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  conversationMessageClearFunction: PropTypes.func.isRequired,
  fetchMessagesFunction: PropTypes.func.isRequired,
  addMessageFunction: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  authentication: state.authentication,
  message: state.message,
});

const mapDispatchToProps = {
  conversationMessageClearFunction: conversationMessageClear,
  fetchMessagesFunction: fetchMessages,
  addMessageFunction: addMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(MessangeScreenContainer);
