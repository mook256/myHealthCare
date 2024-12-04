import React, { Component } from 'react';
import { connect } from 'react-redux';
import Parse from 'parse/react-native';
import { setCurrentUser } from '../../redux/actions/currentuser';
import { sendSOS, sendSOSClear } from '../../redux/actions/sos';
import { staffLogin, getStaffInfo } from '../../redux/actions/staff';
import { withTranslation } from 'react-i18next';
import HomeScreen from './HomeScreen';
import BarButton from '../../components/BarButton';

export class HomeScreenContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { errorMsg: '' };
  }

  logUserInWithIdCard = async (id) => {
    const { setCurrentUser } = this.props;

    if (id.match(/^[0-9]{13}$/)) {
      const UserDetail = Parse.Object.extend('UserDetail');
      const UserDetailQuery = new Parse.Query(UserDetail);
      UserDetailQuery.equalTo('idcard', id);
      const result = await UserDetailQuery.first();
      if (result) {
        const currentUser = {
          userid: result.get('userid'),
          idcard: result.get('idcard'),
          firstname: result.get('firstname'),
          surname: result.get('surname'),
          user: result.get('user'),
          rtdata: result.get('rtDataLatestHistory'),
        };
        setCurrentUser(currentUser);
      } else {
        this.setState({ errorMsg: 'Invalid national ID number' });
      }
    } else {
      this.setState({ errorMsg: 'Invalid national ID number' });
    }
  };

  render() {
    const {
      navigation,
      t,
      config,
      users,
      currentuser,
      sos,
      sendSOS,
      sendSOSClear,
      availableDeviceTypes,
      staffLogin,
      getStaffInfo,
      staffdetail,
    } = this.props;
    const { errorMsg } = this.state;
    return (
      <>
        <HomeScreen
          navigation={navigation}
          handleSubmit={this.logUserInWithIdCard}
          errorMsg={errorMsg}
          config={config}
          users={users}
          sos={sos}
          currentuser={currentuser}
          sendSOS={sendSOS}
          sendSOSClear={sendSOSClear}
          t={t}
          availableDeviceTypes={availableDeviceTypes}
          staffLogin={staffLogin}
          getStaffInfo={getStaffInfo}
          staffdetail={staffdetail}
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
  config: state.config.config,
  users: state.config.users,
  currentuser: state.currentuser,
  sos: state.sos,
  availableDeviceTypes: state.ble.availableDeviceTypes,
  staffdetail: state.staff.staffdetail,
});

const mapDispatchToProps = {
  setCurrentUser,
  sendSOS,
  sendSOSClear,
  staffLogin,
  getStaffInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation(['homeScreen', 'common', 'buttons'])(HomeScreenContainer));
