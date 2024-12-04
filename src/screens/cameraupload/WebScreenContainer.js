import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CameraUploadWebScreen from './WebScreen';
import { lastFetchUser } from '../../redux/actions/authentication';
import { goToMessage } from '../../redux/actions/conversation';

class CameraUploadWebScreenContainer extends Component {
  render() {
    const {
      authentication,
      navigation,
      lastFetchUserFunction,
      goToMessageFunction,
      currentuser,
      config,
      t,
    } = this.props;
    return (
      <CameraUploadWebScreen
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

CameraUploadWebScreenContainer.propTypes = {
  authentication: PropTypes.shape({}).isRequired,
  lastFetchUserFunction: PropTypes.func.isRequired,
  goToMessageFunction: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  authentication: state.authentication,
  currentuser: state.currentuser,
  config: state.config.config,
});

const mapDispatchToProps = {
  lastFetchUserFunction: lastFetchUser,
  goToMessageFunction: goToMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CameraUploadWebScreenContainer);
