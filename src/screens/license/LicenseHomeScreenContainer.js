import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import LicenseHomeScreen from './LicenseHomeScreen';

class LicenseHomeScreenContainer extends Component {
  render() {
    const { t, navigation } = this.props;
    return <LicenseHomeScreen t={t} navigation={navigation} />;
  }
}

export default withTranslation(['licenseScreen', 'common'])(
  LicenseHomeScreenContainer,
);
