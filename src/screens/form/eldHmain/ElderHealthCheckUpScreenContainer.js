import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import EldHScreen from './ElderHealthCheckUpScreen';

export class EldHScreenContainer extends Component {
  render() {
    return <EldHScreen {...this.props} />;
  }
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
  user: state.user,
  currentuser: state.currentuser,
  config: state.config,
});

export default connect(mapStateToProps)(EldHScreenContainer);
