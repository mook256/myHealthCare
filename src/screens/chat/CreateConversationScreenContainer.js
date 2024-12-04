import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CreateConversationScreen from './CreateConversationScreen';
import { addConversation } from '../../redux/actions/conversation';

export class CreateConversationScreenContainer extends PureComponent {
  render() {
    const { authentication, addConversationFunction, navigation, conversation } = this.props;
    return (
      <CreateConversationScreen
        authentication={authentication}
        addConversationFunction={addConversationFunction}
        navigation={navigation}
        conversation={conversation}
      />
    );
  }
}

CreateConversationScreenContainer.propTypes = {
  conversation: PropTypes.object.isRequired,
  authentication: PropTypes.object.isRequired,
  addConversationFunction: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  authentication: state.authentication,
  conversation: {
    isError: state.conversation.isError,
    error: state.conversation.error,
  },
});

const mapDispatchToProps = {
  addConversationFunction: addConversation,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateConversationScreenContainer);
