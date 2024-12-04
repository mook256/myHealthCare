/* eslint-disable */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import PreteleScreen from './PreteleScreen';
import { userLookup } from '../../redux/actions/users';
import { goToMessage } from '../../redux/actions/conversation';

class PreteleScreenContainer extends PureComponent {
  render() {
    const {
      authentication,
      navigation,
      user,
      userLookupFunction,
      goToMessageFunction,
      notification,
      healthdata,
      t,
      config,
    } = this.props;
    return (
      <PreteleScreen
        navigation={navigation}
        user={user}
        authentication={authentication}
        userLookupFunction={userLookupFunction}
        goToMessageFunction={goToMessageFunction}
        notification={notification}
        healthdata={healthdata}
        t={t}
        config={config}
      />
    );
  }
}

PreteleScreenContainer.propTypes = {
  userLookupFunction: PropTypes.func.isRequired,
  goToMessageFunction: PropTypes.func.isRequired,
  user: PropTypes.shape({}).isRequired,
  notification: PropTypes.any.isRequired,
  authentication: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  authentication: state.authentication,
  user: state.user,
  visit: state.visit,
  notification: state.notification,
  healthdata: state.healthdata,
  config: state.config.config,
});

const mapDispatchToProps = {
  userLookupFunction: userLookup,
  goToMessageFunction: goToMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  withTranslation(['healthForm', 'preteleScreen', 'common'])(
    PreteleScreenContainer,
  ),
);
