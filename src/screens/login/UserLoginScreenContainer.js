import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import UserLoginScreen from './UserLoginScreen';
import { setCurrentUser } from '../../redux/actions/currentuser';
import BarButton from '../../components/BarButton';

class UserLoginScreenContainer extends Component {
  render() {
    const {
      navigation,
      config,
      setCurrentUser,
      t,
      availableDeviceTypes,
    } = this.props;
    return (
      <>
        <UserLoginScreen
          navigation={navigation}
          config={config}
          setCurrentUser={setCurrentUser}
          t={t}
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

const mapStateToProps = (state) => ({
  config: state.config,
});

const mapDispatchToProps = {
  setCurrentUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation(['userLoginScreen', 'buttons'])(UserLoginScreenContainer));
