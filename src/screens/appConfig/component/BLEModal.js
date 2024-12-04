import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import _ from 'lodash';
import { List, Button } from 'react-native-paper';
import { BleManager, ScanMode } from 'react-native-ble-plx';
import IconButton from '../../../components/buttons/IconButton';
import { DEVICES } from '../../../services/BLE';

import { PERMISSIONS, requestMultiple } from 'react-native-permissions';

export default class BLEModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      selectedDevice: null,
      selectedKey: null,
      selectedDeviceSetting: null,
      step: 'device',
      error: null,
    };
    this.viableDevices = [];
  }
  async componentDidMount() {
    const { type } = this.props;
    this.viableDevices = DEVICES.filter((d) => d.type === type);
    const serviceUUIDs = this.viableDevices
      .map((d) => d.serviceUUID)
      .reduce((acc, uuid) => {
        if (acc.includes(uuid)) {
          return acc;
        }
        return [...acc, uuid];
      }, []);
    this.manager = new BleManager();
    await requestMultiple([
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    ]);
    this.manager.startDeviceScan(
      serviceUUIDs,
      {
        scanMode: ScanMode.LowLatency,
      },
      async (error, device) => {
        const { devices } = this.state;

        if (error) {
          console.log(error);
          return;
        }
        const newDevices = [...devices];
        const deviceIndex = _.findIndex(newDevices, (o) => o.id === device.id);
        if (deviceIndex === -1) {
          newDevices.push({
            type,
            name: device.name,
            id: device.id,
            rssi: device.rssi,
            serviceUUIDs: device.serviceUUIDs,
            device: device,
          });
        } else {
          newDevices[deviceIndex] = {
            type,
            name: device.name,
            id: device.id,
            rssi: device.rssi,
            serviceUUIDs: device.serviceUUIDs,
            device: device,
          };
        }
        this.setState({ devices: newDevices });
      },
    );
  }

  componentWillUnmount() {
    if (this.manager) {
      this.manager.destroy();
    }
  }

  onSelectDevice(device) {
    this.setState({ selectedDevice: device, step: 'deviceKey' });
  }
  onSelectDeviceKey(key) {
    const device = this.viableDevices.find((d) => d.key === key);
    if (device?.setting) {
      this.setState({ selectedKey: key, step: 'setting' });
    } else if (device?.register) {
      this.setState({ selectedKey: key, step: 'register' });
    } else {
      this.setState({ selectedKey: key, step: 'finish' });
    }
  }
  onSelectSetting(setting) {
    const device = this.viableDevices.find(
      (d) => d.key === this.state.selectedKey,
    );
    if (device?.register) {
      this.setState({ selectedDeviceSetting: setting, step: 'register' });
    } else {
      this.setState({ selectedDeviceSetting: setting, step: 'finish' });
    }
  }

  async onRegister() {
    this.setState({ step: 'loading' });
    const device = this.viableDevices.find(
      (d) => d.key === this.state.selectedKey,
    );
    if (device?.register) {
      const subject = device.register(this.state.selectedDevice.device);
      subject.subscribe(
        (v) => {
          this.setState({
            selectedDeviceSetting: v,
            step: 'finish',
          });
        },
        (e) => {
          this.setState({ step: 'error', error: e });
        },
        () => {
          this.setState({ step: 'finish' });
        },
      );
    }
  }

  renderStep() {
    const { name, onSelect } = this.props;

    const {
      devices,
      step,
      selectedDevice,
      selectedDeviceSetting,
      selectedKey,
    } = this.state;
    if (step === 'device') {
      return (
        <List.Section>
          <List.Subheader>Available Devices for {name}</List.Subheader>
          {devices.map((d) => (
            <List.Item
              key={d.id}
              title={d.name}
              description={`rssi ${d.rssi} : ${d.id}`}
              right={() => (
                <Button onPress={() => this.onSelectDevice(d)}>Select</Button>
              )}
            />
          ))}
        </List.Section>
      );
    }

    if (step === 'deviceKey') {
      return (
        <List.Section>
          <List.Subheader>Select Device for pair for {name}</List.Subheader>
          {this.viableDevices.map((v) => (
            <List.Item
              key={v.key}
              title={v.deviceName}
              right={() => (
                <Button onPress={() => this.onSelectDeviceKey(v.key)}>
                  Select
                </Button>
              )}
            />
          ))}
        </List.Section>
      );
    }
    if (step === 'setting') {
      return null;
    }
    if (step === 'register') {
      return (
        <View>
          <Text style={styles.headerText}>Register Device</Text>
          <Button style={styles.btn} onPress={() => this.onRegister()}>
            <Text style={styles.btnText}>Register</Text>
          </Button>
        </View>
      );
    }
    if (step === 'error') {
      return (
        <View>
          <Text style={styles.headerText}>Error</Text>
          <Text>{this.state.error.message}</Text>
        </View>
      );
    }
    if (step === 'finish') {
      return (
        <View>
          <Text style={styles.headerText}>Setup finish</Text>
          <View style={styles.pullRight}>
            <Button
              style={styles.btnSmall}
              onPress={() =>
                onSelect({
                  id: selectedDevice.id,
                  name: selectedDevice.name,
                  type: selectedDevice.type,
                  device: {
                    key: selectedKey,
                    setting: selectedDeviceSetting,
                  },
                })
              }>
              <Text style={styles.btnText}>Save</Text>
            </Button>
          </View>
        </View>
      );
    }
    if (step === 'loading') {
      return (
        <View>
          <Text style={styles.headerText}>Loading...</Text>
        </View>
      );
    }

    return null;
  }

  render() {
    const { onClose } = this.props;
    return (
      <View style={styles.backgroundShadow}>
        <View style={styles.modalView}>
          <View style={styles.pullRight}>
            <IconButton name="times" onPress={onClose} />
          </View>
          {this.renderStep()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pullRight: {
    alignItems: 'flex-end',
  },
  backgroundShadow: {
    flex: 1,
    paddingTop: '10%',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '70%',
    borderRadius: 20,
  },
  headerText: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  btn: {
    margin: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: 'purple',
  },
  btnSmall: {
    width: 100,
    height: 50,
    backgroundColor: 'purple',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { fontSize: 24, color: 'white' },
  btnClose: { backgroundColor: 'purple' },
});
