import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WebScreen from './WebScreen';
import { lastFetchUser } from '../../redux/actions/authentication';
import { goToMessage } from '../../redux/actions/conversation';

class WebScreenContainer extends Component {
  render() {
    const { authentication, navigation, lastFetchUserFunction, goToMessageFunction } = this.props;
    return (
      <WebScreen
        navigation={navigation}
        authentication={authentication}
        lastFetchUserFunction={lastFetchUserFunction}
        goToMessageFunction={goToMessageFunction}
      />
    );
  }
}

WebScreenContainer.propTypes = {
  authentication: PropTypes.shape({}).isRequired,
  lastFetchUserFunction: PropTypes.func.isRequired,
  goToMessageFunction: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ authentication: state.authentication });

const mapDispatchToProps = {
  lastFetchUserFunction: lastFetchUser,
  goToMessageFunction: goToMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(WebScreenContainer);
