import React, { Component } from 'react';
import { connect } from 'react-redux';
import KeyConfigScreen from './KeyConfigScreen';

import { resetError, registerConfig } from '../../redux/actions/config';

class KeyConfigScreenContainer extends Component {
  render() {
    const { config, navigation, resetError, registerConfig } = this.props;
    return (
      <KeyConfigScreen
        config={config}
        navigation={navigation}
        resetError={resetError}
        registerConfig={registerConfig}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  config: state.config,
});

const mapDispatchToProps = {
  resetError,
  registerConfig,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(KeyConfigScreenContainer);
