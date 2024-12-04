import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import HomeScreen from './MainScreen';
import {
  setHealthRecord,
  saveHealthRecord,
  clearHealthRecord,
} from '../../redux/actions/healthdata';
import BarButton from '../../components/BarButton';

class MainScreenContainer extends PureComponent {
  render() {
    const {
      authentication,
      navigation,
      user,
      currentuser,
      healthdata,
      availableDeviceTypes,
      setHealthRecord,
      saveHealthRecord,
      clearHealthRecord,
      notification,
      config,
      t,
    } = this.props;
    return (
      <>
        <HomeScreen
          navigation={navigation}
          user={user}
          authentication={authentication}
          notification={notification}
          t={t}
          config={config}
          currentuser={currentuser}
          healthdata={healthdata}
          availableDeviceTypes={availableDeviceTypes}
          setHealthRecord={setHealthRecord}
          saveHealthRecord={saveHealthRecord}
          clearHealthRecord={clearHealthRecord}
        />
        <BarButton
          t={t}
          config={config}
          navigation={navigation}
          availableDeviceTypes={availableDeviceTypes}
        />
      </>
    );
  }
}

MainScreenContainer.propTypes = {
  user: PropTypes.shape({}).isRequired,
  notification: PropTypes.any.isRequired,
  authentication: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  authentication: state.authentication,
  user: state.user,
  notification: state.notification,
  currentuser: state.currentuser,
  healthdata: state.healthdata,
  config: state.config.config,
  availableDeviceTypes: state.ble.availableDeviceTypes,
});

const mapDispatchToProps = {
  setHealthRecord,
  saveHealthRecord,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation(['healthForm', 'mainScreen', 'common'])(MainScreenContainer));
