import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Grid, Col } from 'react-native-easy-grid';
import { TouchableOpacity } from 'react-native-gesture-handler';

import BackButton from '../../components/buttons/BackButton';
import { colors, fonts } from '../../styles';

import BLEConfig from './component/BLEConfig';
import StaffConfig from './component/StaffConfig';

import DeviceInfo from 'react-native-device-info';
import Parse from 'parse/react-native';

export default class AppConfigScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeOfContent: '',
    };
  }

  componentDidMount() {
    this.setState({ typeOfContent: 'ble' });
  }

  goBack = () => {
    // override back with main screen
    const { navigation } = this.props;
    navigation.replace('MainScreen');
  };

  renderContentZone(type) {
    const { navigation, devices, saveBleDevices } = this.props;

    if (type === 'ble') {
      return (
        <BLEConfig
          navigation={navigation}
          devices={devices}
          saveBleDevices={saveBleDevices}
        />
      );
    } else if (type === 'staff') {
      return (
        <StaffConfig
          navigation={navigation}
          staff={this.state?.staff}
          devices={devices}
          saveBleDevices={saveBleDevices}
        />
      );
    }
  }

  async getStaff() {
    const DeviceObject = Parse.Object.extend('Device');
    const DeviceQuery = new Parse.Query(DeviceObject);
    DeviceQuery.equalTo('deviceId', DeviceInfo.getUniqueId());
    const Device = await DeviceQuery.first();

    const staff = await Device.get('staffId');

    this.setState({ staff: staff });
  }

  render() {
    const { typeOfContent } = this.state;
    const primaryBg = { backgroundColor: colors.primary };
    const secondaryBg = { backgroundColor: colors.secondary };

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={() => this.goBack()} />
          <View style={styles.titleContainer}>
            <Text style={[commonStyles.textBold, commonStyles.text25]}>
              Device configuration
            </Text>
          </View>
        </View>
        <Grid>
          <Col size={1} style={styles.leftZone}>
            <TouchableOpacity
              style={[
                styles.itemListContainer,
                typeOfContent === 'ble' ? primaryBg : secondaryBg,
              ]}
              onPress={() => {
                this.setState({ typeOfContent: 'ble' });
              }}>
              <Text style={commonStyles.textBold}>BLUETOOTH</Text>
            </TouchableOpacity>
            <TouchableOpacity
              ref={(ref) => (this.staff = ref)}
              style={[
                styles.itemListContainer,
                typeOfContent === 'staff' ? primaryBg : secondaryBg,
              ]}
              onPress={() => {
                this.getStaff();
                this.setState({ typeOfContent: 'staff' });
              }}>
              <Text style={commonStyles.textBold}>STAFF</Text>
            </TouchableOpacity>
          </Col>
          <Col size={4} style={styles.rightZone}>
            {/* <StaffConfig /> */}
            {this.renderContentZone(typeOfContent)}
          </Col>
        </Grid>
      </View>
    );
  }
}

const RADIUS = 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
  },
  leftZone: {
    padding: 10,
    margin: 10,
    borderRightWidth: 1,
    borderColor: colors.primary,
  },
  rightZone: {
    // flex: 1
  },

  titleContainer: {
    paddingLeft: 20,
    paddingTop: 10,
  },
  itemListContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: RADIUS,
    marginBottom: 10,
  },

  bottomPanel: {
    top: 30,
    alignItems: 'center',
  },
  saveButton: {
    width: 220,
    height: 60,
  },
});

const commonStyles = StyleSheet.create({
  textBold: {
    fontWeight: fonts.boldest,
  },
  text25: {
    fontSize: fonts.biggest,
  },
});

const snapStyle = StyleSheet.create({
  bgColor: {
    backgroundColor: 'red',
  },
});
