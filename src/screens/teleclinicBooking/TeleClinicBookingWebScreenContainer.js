import React, { Component } from 'react';
import { connect } from 'react-redux';
import TeleClinicBookingWebScreen from './TeleClinicBookingWebScreen';
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
      currentuser,
    } = this.props;
    const url = navigation.getParam('url');
    return (
      <TeleClinicBookingWebScreen
        authentication={authentication}
        navigation={navigation}
        visit={visit}
        notification={notification}
        config={config}
        t={t}
        url={url}
        currentuser={currentuser}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
  user: state.user,
  visit: state.visit,
  notification: state.notification,
  config: state.config,
  currentuser: state.currentuser,
});

export default connect(
  mapStateToProps,
  null,
)(withTranslation()(TeleClinicBookingScreenContainer));
