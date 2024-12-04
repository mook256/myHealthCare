import React, { Component } from 'react';
import { Alert, View, StyleSheet, Modal } from 'react-native';
import { List, Button, Title } from 'react-native-paper';

import BackButton from '../../components/buttons/BackButton';
import BLEModal from './component/BLEModal';

import {
  BLOOD_PRESSURE,
  BLOOD_GLUCOSE,
  WEIGHT,
  TEMPURATURE,
  OXYGEN_SATURATION,
} from '../../services/BLE/types';

const typeName = {
  [BLOOD_PRESSURE]: 'Blood Pressure',
  [BLOOD_GLUCOSE]: 'Blood Glucose',
  [WEIGHT]: 'Weight',
  [TEMPURATURE]: 'Tempurature',
  [OXYGEN_SATURATION]: 'Oxygen Saturation',
};

export default class BLEConfigScreen extends Component {
  constructor(props) {
    super();
    const { devices } = props;
    // console.log(devices);
    this.state = {
      devices: devices || {
        // [type] : { id, name } or null
        [BLOOD_PRESSURE]: null,
        [BLOOD_GLUCOSE]: null,
        [WEIGHT]: null,
        [TEMPURATURE]: null,
        [OXYGEN_SATURATION]: null,
      },
      modalType: null,
      modalVisible: false,
    };
  }

  openModal = (type) => {
    this.setState({ modalType: type, modalVisible: true });
  };

  closeModal = () => {
    this.setState({ modalType: null, modalVisible: false });
  };

  showChangeDisplay = (type) => {
    this.openModal(type);
  };

  showRemoveAlert = (type) => {
    Alert.alert(
      'Remove bluetooth config',
      `Do you want to remove "${typeName[type]}" config?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          style: 'default',
          onPress: () => {
            const { devices } = this.state;
            this.setState({ devices: { ...devices, [type]: null } });
          },
        },
      ],
    );
  };

  handleDeviceSelect = ({ id, name, type, device }) => {
    const { devices } = this.state;
    this.closeModal();
    this.setState({ devices: { ...devices, [type]: { id, name, device } } });
  };

  handleSave = async () => {
    Alert.alert(
      'save bluetooth config',
      'Do you want to save bluetooth config?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          style: 'default',
          onPress: () => {
            const { devices } = this.state;
            const { saveBleDevices } = this.props;
            saveBleDevices(devices);
            this.goBack();
          },
        },
      ],
    );
  };

  goBack = () => {
    const { navigation } = this.props;
    if (navigation?.state?.routeName === 'BLEConfig') {
      navigation.replace('MainScreen');
    } else {
      navigation.replace('Home');
    }
  };

  renderList = (type) => {
    const device = this.state.devices[type];
    const description =
      device == null ? 'Empty' : `ID: ${device?.id} name: ${device?.name}`;
    return (
      <List.Item
        key={type}
        title={typeName[type]}
        description={description}
        right={() => (
          <>
            <Button onPress={() => this.showChangeDisplay(type)}>Change</Button>
            <Button onPress={() => this.showRemoveAlert(type)}>Remove</Button>
          </>
        )}
      />
    );
  };

  render() {
    const { modalVisible, modalType } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={() => this.goBack()} />
          <Title style={styles.title}>Bluetooth device setting</Title>
        </View>
        <List.Section>
          <List.Subheader>Available Device</List.Subheader>
          {this.renderList(BLOOD_PRESSURE)}
          {this.renderList(WEIGHT)}
          {this.renderList(TEMPURATURE)}
          {this.renderList(OXYGEN_SATURATION)}
          {this.renderList(BLOOD_GLUCOSE)}
        </List.Section>
        <View style={styles.bottomPanel}>
          <Button
            mode="contained"
            contentStyle={styles.saveButton}
            onPress={this.handleSave}>
            Save
          </Button>
        </View>
        <Modal
          presentationStyle={'overFullScreen'}
          animationType={'slide'}
          transparent
          visible={modalVisible}>
          {modalType && (
            <BLEModal
              name={typeName[modalType]}
              type={modalType}
              onSelect={(device) => this.handleDeviceSelect(device)}
              onClose={() => this.closeModal()}
            />
          )}
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    height: 100,
  },
  title: {
    paddingLeft: 10,
  },
  bottomPanel: {
    // position: 'absolute',
    // bottom: 20,
    // right: 20,
    // zIndex: -1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    width: 120,
    height: 60,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    zIndex: 2,
  },
});
