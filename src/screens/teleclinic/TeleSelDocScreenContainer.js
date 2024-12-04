import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Parse from 'parse/react-native';
import moment from 'moment';
import TeleSelDocScreen from './TeleSelDocScreen';
import { userLookup } from '../../redux/actions/users';
import { goToMessage } from '../../redux/actions/conversation';

class TeleSelDocScreenContainer extends PureComponent {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const {
      authentication,
      navigation,
      user,
      userLookupFunction,
      goToMessageFunction,
      notification,
      t,
      config,
    } = this.props;
    return (
      <TeleSelDocScreen
        navigation={navigation}
        user={user}
        authentication={authentication}
        userLookupFunction={userLookupFunction}
        goToMessageFunction={goToMessageFunction}
        notification={notification}
        t={t}
        config={config}
      />
    );
  }
}

TeleSelDocScreenContainer.propTypes = {
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
  config: state.config.config,
});

const mapDispatchToProps = {
  userLookupFunction: userLookup,
  goToMessageFunction: goToMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(TeleSelDocScreenContainer));
