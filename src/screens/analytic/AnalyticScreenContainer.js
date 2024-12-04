import React, { Component } from 'react';
import { connect } from 'react-redux';

import AnalyticScreen from './AnalyticScreen';

class AnalyticScreenContainer extends Component {
  render() {
    const { navigation, currentuser, authentication, config } = this.props;
    return (
      <AnalyticScreen
        navigation={navigation}
        currentuser={currentuser}
        authentication={authentication}
        config={config}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  currentuser: state.currentuser,
  authentication: state.authentication,
  config: state.config,
});

export default connect(mapStateToProps, null)(AnalyticScreenContainer);
