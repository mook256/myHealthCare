import { Text, View } from 'react-native';
import React, { Component } from 'react';

import FaceScreen from './FaceScreen';
import { connect } from 'react-redux';

export class FaceScreenContainer extends Component {
  render() {
    const {
      t,
      navigation,
      currentuser,
      user,
      authentication,
      config,
    } = this.props;

    return <FaceScreen {...this.props} />;
  }
}
const mapStateToProps = (state) => ({
  authentication: state.authentication,
  user: state.user,
  currentuser: state.currentuser,
  config: state.config,
});
export default connect(mapStateToProps)(FaceScreenContainer);
