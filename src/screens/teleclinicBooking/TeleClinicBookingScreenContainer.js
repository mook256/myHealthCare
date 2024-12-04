import React, { Component } from 'react';
import { connect } from 'react-redux';
import TeleClinicBookingScreen from './TeleClinicBookingScreen';
import { withTranslation } from 'react-i18next';

class TeleClinicBookingScreenContainer extends Component {
  render() {
    const {
      authentication,
      navigation,
      visit,
      notification,
      config,
      t,
    } = this.props;
    return (
      <TeleClinicBookingScreen
        authentication={authentication}
        navigation={navigation}
        visit={visit}
        notification={notification}
        config={config}
        t={t}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
  user: state.user,
  visit: state.visit,
  notification: state.notification,
  config: state.config.config,
});

export default connect(
  mapStateToProps,
  null,
)(withTranslation()(TeleClinicBookingScreenContainer));
