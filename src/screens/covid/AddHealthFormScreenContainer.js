import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import AddHealthFormScreen from './AddHealthFormScreen';

export class AddHealthFormScreenContainer extends Component {
  render() {
    return <AddHealthFormScreen {...this.props} />;
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
    AddHealthFormScreenContainer,
  ),
);
