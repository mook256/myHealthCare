import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Parse from 'parse/react-native';
import { setCurrentUser } from '../../redux/actions/currentuser';
import CameraScreen from './CameraScreen';
import BarButton from '../../components/BarButton';

class CameraScreenContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { errorMsg: '' };
  }

  logUserInWithIdCard = async (id) => {
    const { setCurrentUser, config } = this.props;

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
    } else if (id?.length > 0 && config?.partner?.partnerid?.length > 0) {
      const UserHN = Parse.Object.extend('UserPatient');
      const UserHNQuery = new Parse.Query(UserHN);
      UserHNQuery.equalTo('hn', id);
      UserHNQuery.equalTo('partnerid', config?.partner?.partnerid);
      const resultHN = await UserHNQuery.first();

      if (resultHN) {
        const uid = resultHN.get('userid');
        const UserDetail = Parse.Object.extend('UserDetail');
        const UserDetailQuery = new Parse.Query(UserDetail);
        UserDetailQuery.equalTo('userid', uid);
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
          this.setState({ errorMsg: 'Invalid HN ID' });
        }
      } else {
        this.setState({ errorMsg: 'Invalid HN ID' });
      }
    }
  };

  render() {
    const { navigation, t, config, availableDeviceTypes } = this.props;
    const { errorMsg } = this.state;
    return (
      <>
        <CameraScreen
          navigation={navigation}
          handleSubmit={this.logUserInWithIdCard}
          errorMsg={errorMsg}
          config={config}
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
  config: state.config.config,
});

const mapDispatchToProps = {
  setCurrentUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(CameraScreenContainer));
