import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ConversationScreen from './ConversationScreen';
import { fetchConversation, deleteConversation } from '../../redux/actions/conversation';

export class ConversationScreenContainer extends PureComponent {
  componentDidMount() {
    const { fetchConversationFunction } = this.props;
    fetchConversationFunction();
  }

  render() {
    const {
      conversation,
      navigation,
      isNetWorkConnected,
      fetchConversationFunction,
      deleteConversationFunction,
    } = this.props;
    return (
      <ConversationScreen
        conversation={conversation}
        isNetWorkConnected={isNetWorkConnected}
        navigation={navigation}
        fetchConversationFunction={fetchConversationFunction}
        deleteConversationFunction={deleteConversationFunction}
      />
    );
  }
}

ConversationScreenContainer.propTypes = {
  conversation: PropTypes.object.isRequired,
  isNetWorkConnected: PropTypes.bool.isRequired,
  fetchConversationFunction: PropTypes.func.isRequired,
  deleteConversationFunction: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  conversation: state.conversation,
  isNetWorkConnected: state.device.isNetWorkConnected,
});

const mapDispatchToProps = {
  fetchConversationFunction: fetchConversation,
  deleteConversationFunction: deleteConversation,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConversationScreenContainer);
