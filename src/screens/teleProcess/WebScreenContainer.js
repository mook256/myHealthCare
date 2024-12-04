import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TeleProcessWebScreen from './WebScreen';
import { lastFetchUser } from '../../redux/actions/authentication';
import { goToMessage } from '../../redux/actions/conversation';

class TeleProcessWebScreenContainer extends Component {
  render() {
    const { authentication, navigation, lastFetchUserFunction, goToMessageFunction, currentuser, config } = this.props;
    return (
      <TeleProcessWebScreen
        navigation={navigation}
        authentication={authentication}
        lastFetchUserFunction={lastFetchUserFunction}
        goToMessageFunction={goToMessageFunction}
        currentuser={currentuser}
        config={config}
      />
    );
  }
}

TeleProcessWebScreenContainer.propTypes = {
  authentication: PropTypes.shape({}).isRequired,
  lastFetchUserFunction: PropTypes.func.isRequired,
  goToMessageFunction: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ authentication: state.authentication, currentuser: state.currentuser, config: state.config.config });

const mapDispatchToProps = {
  lastFetchUserFunction: lastFetchUser,
  goToMessageFunction: goToMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(TeleProcessWebScreenContainer);
