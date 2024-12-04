import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import InboxListScreen from './InboxListScreen';
import { resetBadgeNumber, fetchNotification } from '../../redux/actions/notification';

class InboxListScreenContainer extends PureComponent {
  componentDidMount() {
    const { fetchNotificationFunction, navigation, resetBadgeNumberFunction } = this.props;
    fetchNotificationFunction();

    let isResetBadgeBefore = false;
    navigation.addListener('didFocus', () => {
      isResetBadgeBefore = true;
      resetBadgeNumberFunction();
    });

    if (!isResetBadgeBefore) {
      resetBadgeNumberFunction();
    }
  }

  render() {
    const {
      authentication,
      notification,
      isNetWorkConnected,
      navigation,
      fetchNotificationFunction,
    } = this.props;
    return (
      <InboxListScreen
        authentication={authentication}
        navigation={navigation}
        notification={notification}
        isNetWorkConnected={isNetWorkConnected}
        fetchNotificationFunction={fetchNotificationFunction}
      />
    );
  }
}

InboxListScreenContainer.propTypes = {
  authentication: PropTypes.object.isRequired,
  notification: PropTypes.object.isRequired,
  fetchNotificationFunction: PropTypes.func.isRequired,
  resetBadgeNumberFunction: PropTypes.func.isRequired,
  isNetWorkConnected: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  authentication: state.authentication,
  notification: state.notification,
  isNetWorkConnected: state.device.isNetWorkConnected,
});

const mapDispatchToProps = {
  resetBadgeNumberFunction: resetBadgeNumber,
  fetchNotificationFunction: fetchNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(InboxListScreenContainer);
