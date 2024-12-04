import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import AdlFormScreen from './AdlFormScreen';

export class AdlFormScreenContainer extends Component {
  render() {
    return <AdlFormScreen {...this.props} />;
  }
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
  user: state.user,
  currentuser: state.currentuser,
  config: state.config,
});

export default connect(mapStateToProps)(
  withTranslation(['healthForm', 'selectCovidForm', 'common'])(
    AdlFormScreenContainer,
  ),
);
