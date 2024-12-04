import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import LicenseScreen from './LicenseScreen';

class LicenseScreenContainer extends Component {
  render() {
    const { t, navigation } = this.props;
    return <LicenseScreen t={t} navigation={navigation} />;
  }
}

export default withTranslation(['licenseScreen', 'common'])(
  LicenseScreenContainer,
);
