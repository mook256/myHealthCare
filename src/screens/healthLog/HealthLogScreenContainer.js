import React, { Component } from 'react';

import HealthLogScreen from './HealthLogScreen';

class HealthLogScreenContainer extends Component {
  render() {
    const { navigation } = this.props;
    const sbp = navigation.getParam('sbp', 0);
    const dbp = navigation.getParam('dbp', 0);
    const hr = navigation.getParam('hr', 0);
    const weight = navigation.getParam('weight', 0);
    const temp = navigation.getParam('temp', 0);
    const spo2 = navigation.getParam('spo2', 0);
    const handleChange = navigation.getParam('handleChange', () => { });

    return (
      <HealthLogScreen
        sbp={sbp}
        dbp={dbp}
        hr={hr}
        weight={weight}
        temp={temp}
        spo2={spo2}
        handleChange={handleChange}
        navigation={navigation}
      />
    );
  }
}

export default HealthLogScreenContainer;
