import { Text, View } from 'react-native';
import React, { Component } from 'react';

import PpsScreen from './PpsScreen';
import { connect } from 'react-redux';

export class PpsScreenContainer extends Component {
  render() {
    const {
      t,
      navigation,
      currentuser,
      user,
      authentication,
      config,
    } = this.props;

    return <PpsScreen {...this.props} />;
  }
}
const mapStateToProps = (state) => ({
  authentication: state.authentication,
  user: state.user,
  currentuser: state.currentuser,
  config: state.config,
});
export default connect(mapStateToProps)(PpsScreenContainer);
