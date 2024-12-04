import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import InboxIconBadge from './InboxIconBadge';

class InboxIconBadgeContainer extends Component {
  render() {
    const { focused, notification, mode } = this.props;
    return <InboxIconBadge focused={focused} notification={notification} mode={mode} />;
  }
}

InboxIconBadgeContainer.defaultProps = {
  focused: false
}

InboxIconBadgeContainer.propTypes = {
  focused: PropTypes.bool,
  notification: PropTypes.shape({}).isRequired,
  mode: PropTypes.string,
};

const mapStateToProps = state => ({
  notification: state.notification,
});

export default connect(mapStateToProps)(InboxIconBadgeContainer);
