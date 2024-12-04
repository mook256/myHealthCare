import React, { Component } from 'react';
import { connect } from 'react-redux';
import Parse from 'parse/react-native';
import { withTranslation } from 'react-i18next';
import { setCurrentUser } from '../../redux/actions/currentuser';
import CardIdLoginScreen from './CardIdLoginScreen';
import BarButton from '../../components/BarButton';

export class LoginScreenContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { errorMsg: '' };
  }

  logUserInWithIdCard = async (id) => {
    const { setCurrentUser, t, config } = this.props;

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
        this.setState({ errorMsg: t('cardIdloginScreen:formError') });
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
          this.setState({ errorMsg: t('cardIdloginScreen:formTextInvalid') });
        }
      } else {
        this.setState({ errorMsg: t('cardIdloginScreen:formTextInvalid') });
      }
    }
  };

  render() {
    const {
      navigation,
      t,
      config,
      availableDeviceTypes,
      authentication,
      sos,
      sendSOS,
      sendSOSClear,
    } = this.props;
    const { errorMsg } = this.state;
    const url = navigation.getParam('url');
    return (
      <>
        <CardIdLoginScreen
          navigation={navigation}
          authentication={authentication}
          handleSubmit={this.logUserInWithIdCard}
          errorMsg={errorMsg}
          config={config}
          t={t}
          url={url}
          sos={sos}
          sendSOS={sendSOS}
          sendSOSClear={sendSOSClear}
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
)(withTranslation(['cardIdLoginScreen', 'buttons'])(LoginScreenContainer));
