import React, { Component } from 'react';
import { connect } from 'react-redux';
import Parse from 'parse/react-native';
import { withTranslation } from 'react-i18next';
import { setCurrentUser } from '../../redux/actions/currentuser';
import StaffLoginScreen from './StaffLoginScreen';

export class StaffLoginScreenContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { errorMsg: '' };
  }

  render() {
    const { navigation, t, config } = this.props;
    const { errorMsg } = this.state;
    return (
      <StaffLoginScreen
        navigation={navigation}
        // handleSubmit={this.logUserInWithIdCard}
        errorMsg={errorMsg}
        config={config}
        t={t}
      />
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
)(withTranslation(['staffLoginScreen', 'buttons'])(StaffLoginScreenContainer));
