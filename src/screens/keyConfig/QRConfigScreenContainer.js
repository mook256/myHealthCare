import React, { Component } from 'react';
import { connect } from 'react-redux';

import { registerConfig } from '../../redux/actions/config';
import QRConfigScreen from './QRConfigScreen';

class QRConfigScreenContainer extends Component {
  render() {
    const { navigation, config, registerConfig } = this.props;
    return (
      <QRConfigScreen
        navigation={navigation}
        config={config}
        registerConfig={registerConfig}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  config: state.config,
});

const mapDispatchToProps = {
  registerConfig,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QRConfigScreenContainer);
