import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveBleDevices } from '../../redux/actions/ble';
import BLEConfigScreen from './BLEConfigScreen';

class BLEConfigScreenContainer extends Component {
  render() {
    const { navigation, saveBleDevices } = this.props;
    const devices = navigation.getParam('devices');
    return (
      <BLEConfigScreen
        navigation={navigation}
        devices={devices}
        saveBleDevices={saveBleDevices}
      />
    );
  }
}

const mapDispatchToProps = {
  saveBleDevices,
};

export default connect(null, mapDispatchToProps)(BLEConfigScreenContainer);
