import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import SelectCovidFormScreen from './SelectCovidFormScreen';

export class SelectCovidFormScreenContainer extends Component {
  render() {
    return <SelectCovidFormScreen {...this.props} />;
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
    SelectCovidFormScreenContainer,
  ),
);
