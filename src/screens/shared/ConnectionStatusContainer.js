import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ConnectionStatus from './ConnectionStatus';

class ConnectionStatusContainer extends PureComponent {
  render() {
    const { isNetWorkConnected } = this.props;
    return <ConnectionStatus isNetWorkConnected={isNetWorkConnected} />;
  }
}

ConnectionStatusContainer.propTypes = {
  isNetWorkConnected: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isNetWorkConnected: state.device.isNetWorkConnected,
});

export default connect(mapStateToProps)(ConnectionStatusContainer);
