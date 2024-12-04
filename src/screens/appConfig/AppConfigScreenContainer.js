import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveBleDevices } from '../../redux/actions/ble';
import AppConfigScreen from './AppConfigScreen';

class AppConfigScreenContainer extends Component {
  render() {
    const { navigation, saveBleDevices } = this.props;
    const devices = navigation.getParam('devices');
    return (
      <AppConfigScreen
        {...this.props}
        navigation={navigation}
        devices={devices}
        saveBleDevices={saveBleDevices}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
  user: state.user,
  currentuser: state.currentuser,
  config: state.config,
});

const mapDispatchToProps = {
  saveBleDevices,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppConfigScreenContainer);
