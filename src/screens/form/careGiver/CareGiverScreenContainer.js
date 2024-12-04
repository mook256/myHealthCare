import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import CareGiverScreen from './CareGiverScreen';

export class CareGiverScreenContainer extends Component {
  render() {
    return <CareGiverScreen {...this.props} />;
  }
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
  user: state.user,
  currentuser: state.currentuser,
  config: state.config,
  healthdata: state.healthdata,
});

export default connect(mapStateToProps)(CareGiverScreenContainer);
